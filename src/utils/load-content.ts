import { Marked } from 'marked'

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
 * Нормализует относительный путь к файлу
 * Пример: "../08_Local_Models/08_00_INDEX.md" -> "08_Local_Models/08_00_INDEX"
 */
function normalizeMarkdownPath(href: string): string {
  // Убираем расширение .md
  let path = href.replace(/\.md$/, '')
  
  // Убираем начальные "../" и "./"
  path = path.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '')
  
  return path
}

/**
 * Создает рендерер для marked с контекстом текущей директории
 */
export function createLinkRenderer(currentDir: string) {
  return {
    link(...args: any[]) {
      // marked может вызвать функцию по-разному в зависимости от версии
      // Старый API: link(href, title, text)
      // Новый API: link(token)
      let href: string, title: string | null, text: string
      
      if (args.length === 3) {
        // Старый API
        [href, title, text] = args
      } else {
        // Новый API - token объект
        const token = args[0]
        href = token.href || token
        title = token.title || null
        text = token.text || href
      }
      
    
    // Проверяем, является ли ссылка внутренней ссылкой на .md файл
    if (href && href.endsWith('.md') && !href.startsWith('http')) {
      // Нормализуем путь: убираем ../, ./ и .md
      const normalizedPath = normalizeMarkdownPath(href)
      
      // Разделяем путь на части
      const pathParts = normalizedPath.split('/').filter(Boolean)
      
      if (pathParts.length >= 2) {
        // Берем все части кроме последней как директорию
        const dir = pathParts.slice(0, -1).join('/')
        const file = pathParts[pathParts.length - 1]
        
        // Проверяем, что dir и file не пустые
        if (dir && file) {
          // Создаем внутреннюю ссылку для Vue Router
          const routerLink = `/post/${dir}/${file}`
          const titleAttr = title ? ` title="${title}"` : ''
          return `<a href="${routerLink}" class="internal-link"${titleAttr}>${text}</a>`
        }
      } else if (pathParts.length === 1) {
        // Ссылка содержит только имя файла без директории
        // Используем текущую директорию из контекста
        const file = pathParts[0]
        
        if (currentDir && file) {
          // Создаем внутреннюю ссылку с текущей директорией
          const routerLink = `/post/${currentDir}/${file}`
          const titleAttr = title ? ` title="${title}"` : ''
          return `<a href="${routerLink}" class="internal-link"${titleAttr}>${text}</a>`
        }
      }
    }
      
      // Для всех остальных ссылок возвращаем стандартный HTML
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr}>${text}</a>`
    }
  }
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
  const modules = import.meta.glob<string>('/content/**/*.md', { query: '?raw', import: 'default' })

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

    // Создаем новый экземпляр Marked с кастомным рендерером
    const markedInstance = new Marked()
    markedInstance.use({ renderer: createLinkRenderer(dir) })
    
    // Конвертируем Markdown в HTML
    const html = await markedInstance.parse(markdown)

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

export interface DirectoryNode {
  name: string
  path: string
  children: DirectoryNode[]
  posts: ParsedPost[]
}

type DirectoryNodeInternal = {
  name: string
  path: string
  children: DirectoryNodeInternal[]
  posts: ParsedPost[]
  childMap: Map<string, DirectoryNodeInternal>
}

export function buildDirectoryTree(): DirectoryNode {
  const root: DirectoryNodeInternal = {
    name: '',
    path: '',
    children: [],
    posts: [],
    childMap: new Map(),
  }

  for (const post of posts) {
    const parts = post.dir.split('/').filter(Boolean)
    let current = root
    let currentPath = ''

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!current.childMap.has(part)) {
        const node: DirectoryNodeInternal = {
          name: part,
          path: currentPath,
          children: [],
          posts: [],
          childMap: new Map(),
        }
        current.childMap.set(part, node)
        current.children.push(node)
      }

      current = current.childMap.get(part)!
    }

    current.posts.push(post)
  }

  const finalize = (node: DirectoryNodeInternal): DirectoryNode => {
    node.children.sort((a, b) => a.name.localeCompare(b.name))
    node.posts.sort((a, b) => a.title.localeCompare(b.title))

    return {
      name: node.name,
      path: node.path,
      posts: node.posts,
      children: node.children.map(finalize),
    }
  }

  return finalize(root)
}

// Поиск поста по dir и id
export function findPost(dir: string, id: string) {
  return posts.find((p) => p.dir === dir && p.id === id)
}

