import type { ReactNode } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/;

/** Renders `**bold**` and `[label](url)` inline markdown. */
export function renderInlineMarkdown(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldStart = remaining.indexOf("**");
    const linkMatch = remaining.match(LINK_PATTERN);
    const linkStart = linkMatch?.index ?? -1;

    const nextBold = boldStart === -1 ? Number.POSITIVE_INFINITY : boldStart;
    const nextLink = linkStart === -1 ? Number.POSITIVE_INFINITY : linkStart;

    if (!Number.isFinite(nextBold) && !Number.isFinite(nextLink)) {
      nodes.push(remaining);
      break;
    }

    if (nextBold <= nextLink) {
      if (boldStart > 0) {
        nodes.push(remaining.slice(0, boldStart));
      }

      const end = remaining.indexOf("**", boldStart + 2);
      if (end === -1) {
        nodes.push(remaining.slice(boldStart));
        break;
      }

      nodes.push(
        <strong key={key++}>
          {renderInlineMarkdown(remaining.slice(boldStart + 2, end))}
        </strong>,
      );
      remaining = remaining.slice(end + 2);
      continue;
    }

    if (linkStart > 0) {
      nodes.push(remaining.slice(0, linkStart));
    }

    const [, label, href] = linkMatch!;
    nodes.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-cyan-700 underline decoration-cyan-700/40 underline-offset-2 hover:text-cyan-900"
      >
        {renderInlineMarkdown(label)}
      </a>,
    );
    remaining = remaining.slice(linkStart + linkMatch![0].length);
  }

  return nodes.length === 1 ? nodes[0] : nodes;
}

/** Splits "title — detail" list items into a stacked title + muted detail. */
function renderListItemContent(text: string): ReactNode {
  const dashIndex = text.indexOf(" — ");
  if (dashIndex === -1) {
    return renderInlineMarkdown(text);
  }

  const title = text.slice(0, dashIndex);
  const detail = text.slice(dashIndex + 3);

  return (
    <>
      <span className="block text-slate-900">{renderInlineMarkdown(title)}</span>
      <span className="mt-0.5 block text-[0.95em] leading-relaxed text-slate-500">
        {renderInlineMarkdown(detail)}
      </span>
    </>
  );
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function isTableSeparatorLine(line: string): boolean {
  if (!isTableRow(line)) return false;
  const cells = line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
  return (
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell) || /^-{3,}$/.test(cell))
  );
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function isTableBlock(block: string): boolean {
  const lines = block.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 2) return false;
  if (!lines.every(isTableRow)) return false;
  return isTableSeparatorLine(lines[1]);
}

function renderTable(block: string, key: number): ReactNode {
  const lines = block.split("\n").filter((line) => line.trim().length > 0);
  const headerCells = parseTableRow(lines[0]);
  const bodyRows = lines.slice(2);

  return (
    <table key={key}>
      <thead>
        <tr>
          {headerCells.map((cell, j) => (
            <th key={j}>{renderInlineMarkdown(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, j) => {
          const cells = parseTableRow(row);
          return (
            <tr key={j}>
              {cells.map((cell, k) => (
                <td key={k}>{renderInlineMarkdown(cell)}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function renderPostContent(content: string): ReactNode[] {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i}>{renderInlineMarkdown(block.replace("## ", ""))}</h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i}>{renderInlineMarkdown(block.replace("### ", ""))}</h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul key={i}>
          {items.map((item, j) => (
            <li key={j}>{renderListItemContent(item.replace("- ", ""))}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(block.split("\n")[0] ?? "")) {
      const items = block.split("\n").filter((line) => /^\d+\.\s/.test(line));
      return (
        <ol key={i}>
          {items.map((item, j) => (
            <li key={j}>{renderListItemContent(item.replace(/^\d+\.\s*/, ""))}</li>
          ))}
        </ol>
      );
    }
    if (isTableBlock(block)) {
      return renderTable(block, i);
    }
    return <p key={i}>{renderInlineMarkdown(block)}</p>;
  });
}
