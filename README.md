# Portfólio — Daniel Neitzel Vieira

Portfólio profissional de Daniel Neitzel Vieira, desenvolvedor front-end. Reúne a apresentação profissional, projetos, currículo e um blog com artigos sobre desenvolvimento e tecnologia.

**Site:** [danielneitzel.com.br](https://danielneitzel.com.br/)

## Sobre esta versão

Esta pasta contém a versão estática do site, com os arquivos JavaScript já compilados. A interface utiliza React, React Router, Framer Motion e styled-components, além de fontes e ícones carregados por serviços externos.

Não há `package.json`, código-fonte em `src/` ou scripts de build nesta cópia. Para executá-la, basta um servidor HTTP estático; não é necessário instalar dependências com npm.

## Executar localmente

Com Python 3 instalado, abra um terminal na pasta do projeto e execute:

```sh
python -m http.server 8000
```

No Windows, também é possível usar `py -m http.server 8000`.

Acesse [http://localhost:8000](http://localhost:8000). Para encerrar o servidor, pressione `Ctrl+C`.

Sirva os arquivos por HTTP ou HTTPS: abrir `index.html` diretamente com `file://` impede o carregamento dos artigos. Fontes do Google e ícones do Font Awesome dependem de acesso à internet. O servidor do Python é indicado para a visualização local e não interpreta `.htaccess`.

## Estrutura

```text
.
├── index.html                 # Entrada do site e metadados
├── assets/                    # JavaScript, CSS e recursos da aplicação
│   └── blog-posts.js           # Carregamento dos artigos em Markdown
├── images/                    # Imagens, capas e miniaturas
├── posts/
│   ├── README.md              # Instruções de manutenção do blog
│   ├── index.json             # Índice e metadados dos artigos
│   └── *.md                   # Conteúdo dos artigos
├── manifest.json              # Metadados para instalação como aplicativo
├── sw.js                      # Service worker e estratégia de cache
├── .htaccess                  # Configuração para servidores Apache
├── CV - Daniel Neitzel Vieira.pdf
└── 400.html, 401.html, 403.html, 404.html, 500.html
```

## Atualizar o blog

Para editar um artigo existente, altere seu arquivo `.md` em `posts/`. O título é extraído do cabeçalho `# Título` e o conteúdo é carregado ao abrir ou recarregar a página.

Para adicionar um artigo:

1. Crie um arquivo Markdown em `posts/`, começando com `# Título do artigo`.
2. Acrescente um objeto ao array de `posts/index.json`, preservando as entradas existentes.
3. Publique o Markdown, o índice atualizado e as imagens utilizadas.

Exemplo de entrada no índice:

```json
{
  "slug": "meu-novo-artigo",
  "file": "meu-novo-artigo.md",
  "date": "2026-11-19",
  "tags": ["JavaScript", "Front-end"],
  "image": "./images/webdevelopment.jpg",
  "excerpt": "Uma breve apresentação do artigo.",
  "author": "Daniel Neitzel",
  "readTime": "3 min"
}
```

Use um `slug` único. Os campos `image`, `excerpt`, `author` e `readTime` são opcionais. Não é necessário alterar os bundles JavaScript para atualizar os artigos cadastrados. Caso o carregamento falhe, o site preserva a versão embutida do artigo, quando disponível, e registra o erro no console.

Consulte também [posts/README.md](posts/README.md).

## Publicação e manutenção

Envie os arquivos desta pasta para uma hospedagem com suporte a arquivos estáticos, preservando a estrutura e os nomes. Inclua `assets/`, `images/`, `posts/`, os currículos, `manifest.json` e `sw.js`. Em servidores Apache, envie também o arquivo oculto `.htaccess` e confira a compatibilidade das diretivas com a hospedagem.

O `.htaccess` atual define a revalidação de HTML, JSON, Markdown e JavaScript. Ele também contém valores de exemplo para variáveis `NEXOMESSAGE_VAPID_*`; essas declarações, por si só, não implementam um serviço de notificações.

Os metadados de busca e compartilhamento ficam em `index.html`; os dados de instalação ficam em `manifest.json`. Os arquivos em `assets/` incluem bundles minificados: mudanças estruturais na interface devem, preferencialmente, ser feitas no projeto-fonte original e compiladas novamente.

Após publicar, confira a página inicial, a abertura dos artigos, as imagens e o acesso ao currículo. Para recursos de service worker em produção, utilize HTTPS. A presença de `manifest.json` e `sw.js` não garante que todo o conteúdo esteja disponível offline.

## Licença

Esta cópia não contém um arquivo de licença do projeto. Para reutilizar o conteúdo, as imagens ou a identidade visual, consulte o autor.
