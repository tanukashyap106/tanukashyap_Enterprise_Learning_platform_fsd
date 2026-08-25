import React from 'react';

/**
 * FormattedMessage Component
 * Parses markdown bold (**text**), italics (*text*), code (`code`), headers (###), lists (- ), and code blocks (```)
 * Renders beautiful HTML without exposing raw markdown symbols like ##, **, *** to the user.
 */
export default function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let listBuffer = [];

  const parseInline = (str) => {
    if (!str) return str;
    const parts = [];
    // Regex for bold **text**, italic *text*, and inline `code`
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={match.index} style={{ fontWeight: 700 }}>
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={match.index} style={{ fontStyle: "italic" }}>
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={match.index}
            style={{
              background: "rgba(249, 87, 42, 0.08)",
              color: "#F9572A",
              padding: "2px 6px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "13px"
            }}
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} style={{ paddingLeft: "20px", margin: "8px 0" }}>
          {listBuffer.map((item, idx) => (
            <li key={idx} style={{ margin: "4px 0", lineHeight: "1.5" }}>
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code block check
    if (line.trim().startsWith("```")) {
      flushList();
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${i}`}
            style={{
              background: "#0F172A",
              color: "#F8FAFC",
              padding: "14px 16px",
              borderRadius: "12px",
              margin: "12px 0",
              fontFamily: "Fira Code, monospace",
              fontSize: "13px",
              overflowX: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            <pre style={{ margin: 0 }}><code>{codeBuffer.join("\n")}</code></pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Heading check (### or #### or ##)
    if (line.trim().startsWith("#")) {
      flushList();
      const headingText = line.replace(/^#+\s*/, "").replace(/\*+/g, "").trim();
      elements.push(
        <h4
          key={`h-${i}`}
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#F9572A",
            margin: "14px 0 6px 0",
            borderBottom: "1px solid rgba(249, 87, 42, 0.15)",
            paddingBottom: "4px"
          }}
        >
          {headingText}
        </h4>
      );
      continue;
    }

    // Unordered list item (- or *)
    if (line.trim().startsWith("- ") || (line.trim().startsWith("* ") && !line.trim().endsWith("*"))) {
      const itemText = line.trim().substring(2);
      listBuffer.push(itemText);
      continue;
    }

    // Ordered list item (1. 2.)
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushList();
      elements.push(
        <div key={`num-${i}`} style={{ margin: "6px 0", display: "flex", gap: "8px", alignItems: "baseline" }}>
          <span style={{ fontWeight: "700", color: "#F9572A", minWidth: "18px" }}>{numMatch[1]}.</span>
          <div style={{ flex: 1 }}>{parseInline(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    flushList();

    // Normal paragraph text
    if (line.trim().length > 0) {
      elements.push(
        <p key={`p-${i}`} style={{ margin: "6px 0", lineHeight: "1.6" }}>
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className="formattedMsgWrapper">{elements}</div>;
}
