import type { ReactNode } from "react";

/** Renders `**bold**` segments as <strong> elements. */
export function renderInlineMarkdown(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const start = remaining.indexOf("**");
    if (start === -1) {
      nodes.push(remaining);
      break;
    }

    if (start > 0) {
      nodes.push(remaining.slice(0, start));
    }

    const end = remaining.indexOf("**", start + 2);
    if (end === -1) {
      nodes.push(remaining.slice(start));
      break;
    }

    nodes.push(
      <strong key={key++}>{remaining.slice(start + 2, end)}</strong>,
    );
    remaining = remaining.slice(end + 2);
  }

  return nodes.length === 1 ? nodes[0] : nodes;
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
            <li key={j}>{renderInlineMarkdown(item.replace("- ", ""))}</li>
          ))}
        </ul>
      );
    }
    if (isTableBlock(block)) {
      return renderTable(block, i);
    }
    return <p key={i}>{renderInlineMarkdown(block)}</p>;
  });
}
