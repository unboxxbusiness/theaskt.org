/**
 * Extracts plain readable text from Sanity Portable Text content blocks.
 * Filters out image nodes, embed widgets, code listings, and metadata.
 */
export function extractArticleText(content: any[] | null | undefined): string {
  if (!content || !Array.isArray(content)) return "";

  const textParts: string[] = [];

  const parseBlock = (block: any) => {
    if (!block) return;

    if (block._type === "block" && block.children) {
      const blockText = block.children
        .map((span: any) => span.text || "")
        .join("")
        .trim();
      
      if (blockText) {
        textParts.push(blockText);
      }
    } else if (block._type === "listGroup" && block.children) {
      block.children.forEach(parseBlock);
    }
  };

  content.forEach(parseBlock);
  return textParts.join("\n\n");
}
