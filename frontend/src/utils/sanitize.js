import DOMPurify from 'dompurify'

/**
 * Sanitize HTML to prevent XSS attacks
 * Allows only safe tags like paragraphs, line breaks, bold, italic
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty) return ''
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false
  })
}

/**
 * Sanitize plain text - strips all HTML
 */
export const sanitizeText = (dirty) => {
  if (!dirty) return ''
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true
  })
}

/**
 * Convert newlines to <br> tags and sanitize
 */
export const textToSafeHTML = (text) => {
  if (!text) return ''
  
  const withBreaks = text
    .split('\n')
    .map(line => sanitizeText(line))
    .join('<br />')
  
  return withBreaks
}

