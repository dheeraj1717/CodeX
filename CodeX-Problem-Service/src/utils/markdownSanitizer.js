const marked = require("marked");
const sanitizeHtml = require("sanitize-html");
const TurndownService = require("turndown");

function sanitizeMarkdown(markdownContent) {
  const turndownService = new TurndownService();
  // 1. Convert markdown to html
  const convertedHtml = marked.parse(markdownContent);
  // 2. Sanitize the html
  const sanitizedHtml = sanitizeHtml(convertedHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  });
  // 3. Convert sanitized html back to markdown
  const sanitizedMarkdown = turndownService.turndown(sanitizedHtml);
  return sanitizedMarkdown;
}

module.exports = sanitizeMarkdown;
