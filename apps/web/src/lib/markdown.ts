export function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        html.push('</code></pre>');
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        html.push('<pre><code>');
      }
      continue;
    }

    if (inCodeBlock) {
      html.push(escapeHtml(trimmed) + '\n');
      continue;
    }

    if (trimmed === '---') {
      closeList(html, inList, listType);
      inList = false;
      html.push('<hr />');
      continue;
    }

    const headerMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      closeList(html, inList, listType);
      inList = false;
      const level = headerMatch[1]!.length;
      const text = inlineFormat(headerMatch[2]!);
      html.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    const liMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (liMatch) {
      if (!inList || listType !== 'ul') {
        closeList(html, inList, listType);
        html.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      html.push(`<li>${inlineFormat(liMatch[1]!)}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        closeList(html, inList, listType);
        html.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      html.push(`<li>${inlineFormat(olMatch[1]!)}</li>`);
      continue;
    }

    if (trimmed === '' && trimmed === '') {
      closeList(html, inList, listType);
      inList = false;
      continue;
    }

    if (trimmed) {
      closeList(html, inList, listType);
      inList = false;
      html.push(`<p>${inlineFormat(trimmed)}</p>`);
    }
  }

  closeList(html, inList, listType);
  if (inCodeBlock) html.push('</code></pre>');

  return html.join('\n');
}

function inlineFormat(text: string): string {
  let result = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function closeList(html: string[], inList: boolean, listType: 'ul' | 'ol' | null) {
  if (inList && listType) {
    html.push(`</${listType}>`);
  }
}
