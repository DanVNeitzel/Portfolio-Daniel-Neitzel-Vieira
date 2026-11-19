# Atualizar o blog

Para editar um artigo cadastrado, altere o respectivo arquivo `.md` desta pasta.
O título vem da primeira linha `# Título` e o conteúdo é carregado ao abrir ou
recarregar a página. Não é necessário editar os arquivos JavaScript compilados.

Para publicar um novo artigo:

1. Crie um arquivo `.md` com a primeira linha `# Título do artigo`.
2. Adicione uma entrada em `index.json` com `slug` (endereço único do artigo),
   `file` (nome do arquivo), `date` (`AAAA-MM-DD`) e `tags` (lista).
3. Opcionalmente, informe `image`, `excerpt`, `author` e `readTime`.
4. Envie o Markdown e o `index.json` atualizados para a pasta `posts` no servidor.

Na primeira publicação desta correção, envie também `index.html`, `.htaccess`
e a pasta `assets` atualizados. Depois, recarregue o site.

O site precisa ser servido por HTTP/HTTPS; abrir `index.html` diretamente por
`file://` não permite carregar os artigos. Os artigos antigos ainda embutidos
no site continuam disponíveis. Se um arquivo falhar, sua versão embutida é
preservada e o erro é registrado no console do navegador.
