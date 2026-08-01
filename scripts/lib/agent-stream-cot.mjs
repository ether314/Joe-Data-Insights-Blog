/**
 * Format Cursor agent CLI stream-json NDJSON lines into human CoT log lines.
 *
 * Pretty line prefixes (parsed by the dashboard):
 *   [cot:thought]  assistant reasoning / text
 *   [cot:tool]     tool_call started/completed
 *   [cot:system]   session init / result
 *   [cot:user]     user prompt echo
 *
 * Usage:
 *   node scripts/lib/agent-stream-cot.mjs --format '{"type":"assistant",...}'
 *   agent ... | node scripts/lib/agent-stream-cot.mjs --tee [--raw out.ndjson]
 */

import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

const COT_PREFIX = {
  thought: "[cot:thought]",
  tool: "[cot:tool]",
  system: "[cot:system]",
  user: "[cot:user]",
  agent: "[cot:agent]",
};

function contentText(message) {
  const parts = message?.content;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((p) => {
      if (!p) return "";
      if (typeof p === "string") return p;
      if (typeof p.text === "string") return p.text;
      if (typeof p.content === "string") return p.content;
      return "";
    })
    .join("");
}

function summarizeToolCall(toolCall) {
  if (!toolCall || typeof toolCall !== "object") return "tool";
  if (toolCall.readToolCall) {
    const p = toolCall.readToolCall.args?.path || "?";
    return `read ${p}`;
  }
  if (toolCall.writeToolCall) {
    const p = toolCall.writeToolCall.args?.path || "?";
    return `write ${p}`;
  }
  if (toolCall.function) {
    const name = toolCall.function.name || "function";
    let args = toolCall.function.arguments || "";
    if (typeof args === "object") {
      try {
        args = JSON.stringify(args);
      } catch {
        args = String(args);
      }
    }
    args = String(args).replace(/\s+/g, " ").slice(0, 120);
    return `${name}${args ? ` ${args}` : ""}`;
  }
  const key = Object.keys(toolCall)[0] || "tool";
  const args = toolCall[key]?.args;
  let detail = "";
  if (args && typeof args === "object") {
    detail = args.path || args.command || args.pattern || args.query || "";
  }
  return `${key.replace(/ToolCall$/, "")}${detail ? ` ${detail}` : ""}`;
}

/** Soft / hard caps for coalescing stream-partial thought fragments. */
const THOUGHT_SOFT_CHARS = 360;
const THOUGHT_HARD_CHARS = 720;

/**
 * Flush buffered thought when we hit a natural break (sentence / paragraph),
 * not every ~100-char partial. Hard-cap prevents unbounded rows.
 * @param {string} buffered
 * @param {string} [chunk]
 */
export function shouldFlushThought(buffered, chunk = "") {
  const text = String(buffered || "");
  if (!text.trim()) return false;
  const piece = String(chunk || "");
  // Paragraph break
  if (/\n\s*\n/.test(piece) || /\n\s*\n/.test(text.slice(-4))) return true;
  // Sentence end after enough substance (avoid tiny "Yes." rows)
  if (text.length >= 80 && /[.!?]["')\]]?\s*$/.test(text)) return true;
  // Soft cap only at whitespace / clause boundary
  if (
    text.length >= THOUGHT_SOFT_CHARS &&
    (/[.!?;:]\s*$/.test(text) || /,\s*$/.test(text) || /\s$/.test(text))
  ) {
    return true;
  }
  return text.length >= THOUGHT_HARD_CHARS;
}

function emitThought(state, extra = "") {
  const body = `${state.buffer?.text || ""}${extra}`.replace(/\s+/g, " ").trim();
  if (state.buffer) state.buffer.text = "";
  if (!body) return [];
  return [`${COT_PREFIX.thought} ${body}`];
}

/**
 * @param {string} line
 * @param {{ buffer?: { text: string }, seenPartial?: boolean }} [state]
 * @returns {{ lines: string[], kind?: string }}
 */
export function formatAgentStreamLine(line, state = {}) {
  const raw = String(line ?? "").trimEnd();
  if (!raw.trim()) return { lines: [] };

  if (!raw.trimStart().startsWith("{")) {
    return { lines: [raw] };
  }

  let ev;
  try {
    ev = JSON.parse(raw);
  } catch {
    return { lines: [raw] };
  }

  const type = String(ev.type || "");
  const subtype = String(ev.subtype || "");

  if (type === "thinking") {
    const text = ev.text || ev.delta || contentText(ev.message) || "";
    if (!text) return { lines: [] };
    if (!state.buffer) state.buffer = { text: "" };
    if (subtype === "delta") {
      state.buffer.text += text;
      if (shouldFlushThought(state.buffer.text, text)) {
        return { lines: emitThought(state), kind: "thought" };
      }
      return { lines: [] };
    }
    if (subtype === "completed") {
      return { lines: emitThought(state, text), kind: "thought" };
    }
    return { lines: emitThought(state, text), kind: "thought" };
  }

  if (type === "assistant") {
    const hasTs = Object.prototype.hasOwnProperty.call(ev, "timestamp_ms");
    const hasMc = Object.prototype.hasOwnProperty.call(ev, "model_call_id");
    // Skip buffered duplicate flushes (stream-partial-output)
    if (hasTs && hasMc) return { lines: [] };
    if (!hasTs && state.seenPartial) return { lines: [] };

    const text = contentText(ev.message);
    if (!text) return { lines: [] };

    if (hasTs && !hasMc) {
      state.seenPartial = true;
      if (!state.buffer) state.buffer = { text: "" };
      state.buffer.text += text;
      if (shouldFlushThought(state.buffer.text, text)) {
        return { lines: emitThought(state), kind: "thought" };
      }
      return { lines: [] };
    }

    // Final non-partial assistant message: flush buffer + this text as one thought.
    const lines = emitThought(state, text);
    return { lines, kind: "thought" };
  }

  if (type === "tool_call") {
    const flushed = [];
    if (state.buffer?.text?.trim()) {
      flushed.push(`${COT_PREFIX.thought} ${state.buffer.text.trim()}`);
      state.buffer.text = "";
    }
    const summary = summarizeToolCall(ev.tool_call);
    const verb = subtype === "completed" ? "done" : "start";
    flushed.push(`${COT_PREFIX.tool} ${verb} ${summary}`);
    return { lines: flushed, kind: "tool" };
  }

  if (type === "system") {
    if (subtype === "init") {
      return {
        lines: [
          `${COT_PREFIX.system} session model=${ev.model || "?"} cwd=${ev.cwd || "?"}`,
        ],
        kind: "system",
      };
    }
    return {
      lines: [`${COT_PREFIX.system} ${subtype || "event"}`],
      kind: "system",
    };
  }

  if (type === "user") {
    const text = contentText(ev.message).replace(/\s+/g, " ").slice(0, 200);
    return {
      lines: [`${COT_PREFIX.user} ${text}${text.length >= 200 ? "…" : ""}`],
      kind: "user",
    };
  }

  if (type === "result") {
    const flushed = [];
    if (state.buffer?.text?.trim()) {
      flushed.push(`${COT_PREFIX.thought} ${state.buffer.text.trim()}`);
      state.buffer.text = "";
    }
    const ok = ev.is_error ? "error" : "ok";
    const dur = ev.duration_ms != null ? `${ev.duration_ms}ms` : "";
    const preview = String(ev.result || "")
      .replace(/\s+/g, " ")
      .slice(0, 240);
    flushed.push(
      `${COT_PREFIX.system} result ${ok}${dur ? ` ${dur}` : ""}${preview ? ` — ${preview}` : ""}`,
    );
    return { lines: flushed, kind: "system" };
  }

  return {
    lines: [`${COT_PREFIX.agent} ${type}${subtype ? `/${subtype}` : ""}`],
    kind: "agent",
  };
}

export function flushAgentStreamBuffer(state = {}) {
  if (!state.buffer?.text?.trim()) return [];
  const out = [`${COT_PREFIX.thought} ${state.buffer.text.trim()}`];
  state.buffer.text = "";
  return out;
}

function parseArgs(argv) {
  const out = { format: null, tee: false, raw: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--tee") out.tee = true;
    else if (a === "--format") out.format = argv[++i];
    else if (a === "--raw") out.raw = argv[++i];
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.format != null) {
    const { lines } = formatAgentStreamLine(args.format, { buffer: { text: "" } });
    for (const l of lines) process.stdout.write(`${l}\n`);
    return;
  }

  const state = { buffer: { text: "" }, seenPartial: false };
  let rawFd = null;
  if (args.raw) {
    fs.mkdirSync(path.dirname(args.raw), { recursive: true });
    rawFd = fs.openSync(args.raw, "a");
  }

  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on("line", (line) => {
    if (rawFd != null) fs.writeSync(rawFd, `${line}\n`);
    const { lines } = formatAgentStreamLine(line, state);
    for (const l of lines) process.stdout.write(`${l}\n`);
  });
  rl.on("close", () => {
    for (const l of flushAgentStreamBuffer(state)) process.stdout.write(`${l}\n`);
    if (rawFd != null) fs.closeSync(rawFd);
  });
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) main();
