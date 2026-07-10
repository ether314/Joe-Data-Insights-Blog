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
    return <p key={i}>{renderInlineMarkdown(block)}</p>;
  });
}
