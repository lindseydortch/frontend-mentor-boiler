export function toTitleCase(slug) {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export function githubAnchor(heading) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, '')
    .replace(/ /g, '-')
}

export function renderTemplate(source, tokens) {
  return source.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    if (!(key in tokens)) {
      throw new Error(`Missing template token "${key}" while rendering template`)
    }
    return tokens[key]
  })
}
