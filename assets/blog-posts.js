// Markdown files are the source of truth for posts registered in posts/index.json.
export async function loadBlogPosts(bundledPosts) {
  const base = new URL('../posts/', import.meta.url);
  const get = async (url, type) => {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Blog: ${response.status} ao carregar ${url}`);
    return response[type]();
  };

  try {
    const entries = await get(new URL('index.json', base), 'json');
    if (!Array.isArray(entries)) throw new Error('Blog: índice inválido');
    const posts = new Map(bundledPosts.map(post => [post.slug, post]));
    await Promise.all(entries.map(async entry => {
      try {
        if (!entry.slug || !entry.file) throw new Error('Blog: artigo sem slug ou arquivo');
        const markdown = (await get(new URL(entry.file, base), 'text')).replace(/\r\n?/g, '\n');
        if (!/^#\s+\S/m.test(markdown)) throw new Error('Blog: Markdown sem título');
        const previous = posts.get(entry.slug) || {};
        const title = markdown.match(/^#\s+(.+)$/m)[1].trim();
        const content = markdown.replace(/^#\s+.+\n*/, '').trim();
        const excerpt = content.split(/\n\s*\n/).find(part => !/^Publicado em\b/.test(part) && !/^#/.test(part)) || '';
        const { file, ...metadata } = entry;
        posts.set(entry.slug, {
          author: 'Daniel Neitzel', tags: [], image: './images/webdevelopment.jpg',
          ...previous, ...metadata,
          id: previous.id ?? entry.slug,
          title: entry.title || title,
          excerpt: entry.excerpt || excerpt,
          content,
          readTime: entry.readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`
        });
      } catch (error) {
        console.error('Não foi possível atualizar o artigo:', entry.slug, error);
      }
    }));
    return [...posts.values()].sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Não foi possível atualizar o blog. Usando os artigos locais.', error);
    return bundledPosts;
  }
}
