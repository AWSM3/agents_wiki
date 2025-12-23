import { marked } from 'marked'

export interface ParsedPost {
  id: string
  dir: string
  path: string
  title: string
  meta: Record<string, unknown>
  content: string
  html: string
}

/**
 * Простой парсер YAML frontmatter (без зависимостей)
 * Парсит блок вида:
 * ---
 * title: "Заголовок"
 * date: "2025-12-24"
 * ---
 * Остальное содержимое
 */
function parseFrontmatter(text: string): { meta: Record<string, unknown>; content: string } {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!match) {
    return { meta: {}, content: text }
  }

  const [, frontmatterStr, content] = match
  const meta: Record<string, unknown> = {}

  // Простой парсер YAML (только базовый синтаксис)
  frontmatterStr.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return

    const key = line.substring(0, colonIdx).trim()
    let value = line.substring(colonIdx + 1).trim()

    // Убираем кавычки
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    meta[key] = value
  })

  return { meta, content }
}

async function loadMarkdownContent(): Promise<ParsedPost[]> {
  // Загружаем все .md файлы рекурсивно из content/
  const modules = import.meta.glob<string>('/content/**/*.md', { as: 'raw' })

  const posts: ParsedPost[] = []

  for (const [filePath, importFn] of Object.entries(modules)) {
    // Парсим путь: /content/blog/my-post.md -> { dir: 'blog', id: 'my-post' }
    const match = filePath.match(/\/content\/(.+?)\/([^/]+)\.md$/)
    if (!match) continue

    const dir = match[1]
    const id = match[2]
    const path = `${dir}/${id}`

    // Вызываем функцию чтобы получить содержимое
    const content = await (importFn as unknown as () => Promise<string>)()

    // Парсим frontmatter (собственный парсер)
    const { meta, content: markdown } = parseFrontmatter(content)

    // Конвертируем Markdown в HTML
    const html = await marked(markdown)

    posts.push({
      id,
      dir,
      path,
      title: (meta.title as string) || id,
      meta,
      content: markdown,
      html,
    })
  }

  return posts.sort((a, b) => {
    // Сортируем по дате (если есть в meta), или по названию
    const dateA = (a.meta.date as string) || ''
    const dateB = (b.meta.date as string) || ''
    if (dateA && dateB) return new Date(dateB).getTime() - new Date(dateA).getTime()
    return a.title.localeCompare(b.title)
  })
}

export const posts = await loadMarkdownContent()

// Группируем посты по директориям
export function groupByDirectory() {
  const grouped = new Map<string, ParsedPost[]>()
  for (const post of posts) {
    if (!grouped.has(post.dir)) {
      grouped.set(post.dir, [])
    }
    grouped.get(post.dir)!.push(post)
  }
  return grouped
}

// Поиск поста по dir и id
export function findPost(dir: string, id: string) {
  return posts.find((p) => p.dir === dir && p.id === id)
}

