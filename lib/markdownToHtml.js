import xss from "xss";

/**
 * Convert Markdown to styled HTML with XSS protection
 * Handles headings, bold, italic, lists, and paragraphs
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return "";

  let html = markdown;

  // Process markdown patterns BEFORE sanitization
  // H1-H6 headings
  html = html.replace(/^### (.+)$/gm, "<h3 class='font-bold text-lg mt-3 mb-2 text-gray-900'>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 class='font-bold text-xl mt-4 mb-3 text-gray-900'>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 class='font-bold text-2xl mt-5 mb-3 text-gray-900'>$1</h1>");

  // Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-gray-900'>$1</strong>");

  // Italic *text*
  html = html.replace(/\*(.+?)\*/g, "<em class='italic text-gray-700'>$1</em>");

  // Links [text](url) - keep safe URLs only
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, (match, text, url) => {
    // Only allow http, https, mailto, and relative URLs
    if (/^(https?:\/\/|mailto:|\/|\.\/)/i.test(url)) {
      return `<a href='${url}' class='text-blue-600 hover:underline'>$1</a>`;
    }
    return text; // Return just the text if URL is suspicious
  });

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p class='text-gray-700 leading-relaxed mb-3'>");
  html = html.replace(/\n/g, "<br />");

  // Wrap in paragraph
  html = `<p class='text-gray-700 leading-relaxed mb-3'>${html}</p>`;

  // Clean up extra paragraph tags
  html = html.replace(/<p><p/g, "<p");
  html = html.replace(/<\/p><\/p>/g, "</p>");

  // NOW sanitize with XSS to remove any malicious scripts
  const cleaned = xss(html, {
    whiteList: {
      h1: ["class"],
      h2: ["class"],
      h3: ["class"],
      strong: ["class"],
      em: ["class"],
      a: ["href", "class"],
      p: ["class"],
      br: [],
    },
    stripIgnoreTag: true,
    stripLeakage: true,
  });

  return cleaned;
};

/**
 * Sanitize and render markdown description
 */
export const sanitizeAndRenderDescription = (description) => {
  if (!description) return "";
  return markdownToHtml(description);
};
