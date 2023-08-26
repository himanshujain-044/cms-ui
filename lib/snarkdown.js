//https://github.com/developit/snarkdown

const TAGS = {
  // Define custom tags for various markdown elements.
  '': ['<em>', '</em>'], // Emphasis
  _: ['<strong>', '</strong>'], // Strong emphasis
  '*': ['<strong>', '</strong>'], // Alternative for strong emphasis
  '~': ['<s>', '</s>'], // Strikethrough
  '\n': ['<br />'], // Line break
  ' ': ['<br />'], // Alternative line break
  '-': ['<hr />'] // Horizontal rule
}

function outdent(str) {
  // Outdent a string based on the first indented line's leading whitespace.
  return str.replace(RegExp('^' + (str.match(/^(\t| )+/) || '')[0], 'gm'), '')
}

function encodeAttr(str) {
  // Encode special attribute characters to HTML entities in a String.
  return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function tag(token) {
  // Apply tags based on the token type.
  const desc = TAGS[token[1] || '']
  const end = context[context.length - 1] === token
  if (!desc) return token
  if (!desc[1]) return desc[0]
  if (end) context.pop()
  else context.push(token)
  return desc[end | 0]
}

function parse(md, prevLinks) {
  const tokenizer =
    /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm

  let context = [],
    out = '',
    links = prevLinks || {},
    last = 0,
    chunk,
    prev,
    token,
    inner,
    t

  function flush() {
    let str = ''
    while (context.length) str += tag(context[context.length - 1])
    return str
  }

  md = md
    .replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
      // Handle link references and store them in the links object.
      links[name.toLowerCase()] = url
      return ''
    })
    .replace(/^\n+|\n+$/g, '')

  while ((token = tokenizer.exec(md))) {
    prev = md.substring(last, token.index)
    last = tokenizer.lastIndex
    chunk = token[0]
    if (prev.match(/[^\\](\\\\)*\\$/)) {
      // Escaped
    } else if ((t = token[3] || token[4])) {
      // Code/Indent blocks
      chunk =
        '<pre class="code ' +
        (token[4] ? 'poetry' : token[2].toLowerCase()) +
        '"><code' +
        (token[2] ? ` class="language-${token[2].toLowerCase()}"` : '') +
        '>' +
        outdent(encodeAttr(t).replace(/^\n+|\n+$/g, '')) +
        '</code></pre>'
    } else if ((t = token[6])) {
      // > Quotes, -* lists
      if (t.match(/\./)) {
        token[5] = token[5].replace(/^\d+/gm, '')
      }
      inner = parse(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')))
      if (t == '>') t = 'blockquote'
      else {
        t = t.match(/\./) ? 'ol' : 'ul'
        inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>')
      }
      chunk = '<' + t + '>' + inner + '</' + t + '>'
    } else if (token[10]) {
      // Links
      out = out.replace('<a>', `<a href="${encodeAttr(token[11] || links[prev.toLowerCase()])}">`)
      chunk = flush() + '</a>'
    } else if (token[9]) {
      chunk = '<a>'
    } else if (token[16]) {
      // `code`
      chunk = '<code>' + encodeAttr(token[16]) + '</code>'
    } else if (token[17] || token[1]) {
      // Inline formatting: *em*, **strong** & friends
      chunk = tag(token[17] || '--')
    }
    out += prev
    out += chunk
  }

  return (out + md.substring(last) + flush()).replace(/^\n+|\n+$/g, '')
}

export default parse
