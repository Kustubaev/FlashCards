/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/utils/markdown-renderer
 * Description: Markdown + LaTeX rendering pipeline
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import type { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  return `<img class="flashcard-img" src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`;
};
marked.setOptions({ renderer });

interface LatexBlock {
  placeholder: string;
  rendered: string;
}

/**
 * Render raw text with Markdown and LaTeX to safe HTML
 */
export function renderContent(rawText: string, sanitizer: DomSanitizer): SafeHtml {
  if (!rawText.trim()) {
    return sanitizer.bypassSecurityTrustHtml('');
  }

  try {
    const latexBlocks: LatexBlock[] = [];
    let text = extractLatex(rawText, latexBlocks);
    let html = marked.parse(text, { async: false }) as string;
    html = restoreLatex(html, latexBlocks);
    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ['span', 'mjx-container'],
      ADD_ATTR: ['class', 'style', 'xmlns', 'display'],
    });
    return sanitizer.bypassSecurityTrustHtml(sanitized);
  } catch {
    return sanitizer.bypassSecurityTrustHtml(escapeHtml(rawText));
  }
}

/**
 * Extract LaTeX expressions from text and replace with placeholders
 */
function extractLatex(text: string, blocks: LatexBlock[]): string {
  let result = text;

  // Block LaTeX: $$...$$
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_match, formula) => {
    const placeholder = `%%LATEX_BLOCK_${blocks.length}%%`;
    try {
      const rendered = katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false });
      blocks.push({ placeholder, rendered });
    } catch {
      blocks.push({ placeholder, rendered: escapeHtml(`$$${formula}$$`) });
    }
    return placeholder;
  });

  // Inline LaTeX: $...$
  result = result.replace(/\$([^\$\n]+?)\$/g, (_match, formula) => {
    const placeholder = `%%LATEX_INLINE_${blocks.length}%%`;
    try {
      const rendered = katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false });
      blocks.push({ placeholder, rendered });
    } catch {
      blocks.push({ placeholder, rendered: escapeHtml(`$${formula}$`) });
    }
    return placeholder;
  });

  return result;
}

/**
 * Restore LaTeX placeholders with rendered HTML
 */
function restoreLatex(html: string, blocks: LatexBlock[]): string {
  let result = html;
  for (const block of blocks) {
    result = result.replaceAll(block.placeholder, block.rendered);
  }
  return result;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
