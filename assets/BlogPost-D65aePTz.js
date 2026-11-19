import{j as t,m as N}from"./motion-_9VZG8uU.js";import{d as B,u as P,a as S,r as j}from"./router-DDemUlEg.js";import{d as o}from"./styled-Fec-KKY9.js";import{b as E,u as M,C as w,T as D,a as F,S as L}from"./index-BbI46dBt-combr-symbols-php2026-capa.js";import"./vendor-Bzgz95E1.js";const y=o(L)`
  background: #333333;
  padding: 2rem 0;
  min-height: 100vh;
  @media (max-width: ${e=>e.theme.breakpoints.desktop}) {
    padding: 7rem 0 2rem!important;
  }
`,v=o.button`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  color: ${e=>e.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  margin-bottom: ${e=>e.theme.spacing.xl};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border: 1px solid ${e=>e.theme.colors.primary};
  border-radius: 6px;
  transition: all 0.3s ease;
  background: none;
  cursor: pointer;

  &:hover {
  background: ${e=>e.theme.colors.primary};
  color: ${e=>e.theme.colors.background};
  }

  i {
  font-size: 0.9rem;
  }
`,W=o.div`
  margin-bottom: ${e=>e.theme.spacing.xxl};
  text-align: center;
`,q=o.img`
  width: 100%;
  max-width: 800px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: ${e=>e.theme.spacing.xl};
  box-shadow: ${e=>e.theme.shadows.strong};
`,H=o.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.gradientText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (max-width: ${e=>e.theme.breakpoints.tablet}) {
  font-size: 2rem;
  }
`,O=o.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${e=>e.theme.spacing.lg};
  margin-bottom: ${e=>e.theme.spacing.xl};
  font-size: 1rem;
  color: ${e=>e.theme.colors.textMuted};
`,R=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,Y=o.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${e=>e.theme.spacing.sm};
  margin-bottom: ${e=>e.theme.spacing.xxl};
`,U=o.span`
  background: ${e=>e.theme.colors.backgroundAlt};
  color: ${e=>e.theme.colors.primary};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid ${e=>e.theme.colors.border};
`,C=o.button`
  background: ${e=>e.theme.colors.backgroundAlt};
  color: ${e=>e.theme.colors.primary};
  border: 1px solid ${e=>e.theme.colors.border};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.md};

  &:hover {
  background: ${e=>e.theme.colors.primary};
  color: ${e=>e.theme.colors.background};
  transform: translateY(-2px);
  box-shadow: ${e=>e.theme.shadows.medium};
  }

  &:active {
  transform: translateY(0);
  }

  i {
  font-size: 1rem;
  }

  &.copied {
  background: ${e=>e.theme.colors.success||"#4CAF50"};
  color: white;
  border-color: ${e=>e.theme.colors.success||"#4CAF50"};
  }
`,G=o.div`
  display: flex;
  justify-content: center;
  margin: ${e=>e.theme.spacing.xl} 0;
  padding: ${e=>e.theme.spacing.lg};
  background: ${e=>e.theme.colors.backgroundAlt};
  border-radius: 12px;
  border: 1px solid ${e=>e.theme.colors.border};
`,J=o.div`
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 1.1rem;
  color: ${e=>e.theme.colors.text};

  h1, h2, h3, h4, h5, h6 {
  margin-top: ${e=>e.theme.spacing.xxl};
  margin-bottom: ${e=>e.theme.spacing.lg};
  background: ${e=>e.theme.colors.gradientText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.8rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.3rem; }
  h5 { font-size: 1.2rem; }
  h6 { font-size: 1.1rem; }

  p {
  margin-bottom: ${e=>e.theme.spacing.lg};
  text-align: justify;
  }

  ul, ol {
  margin-bottom: ${e=>e.theme.spacing.lg};
  padding-left: ${e=>e.theme.spacing.xl};
  }

  li {
  margin-bottom: ${e=>e.theme.spacing.sm};
  }

  code {
  background: ${e=>e.theme.colors.backgroundAlt};
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
  border: 1px solid ${e=>e.theme.colors.border};
  }

  pre {
  background: ${e=>e.theme.colors.backgroundAlt};
  padding: ${e=>e.theme.spacing.lg};
  border-radius: 8px;
  overflow-x: auto;
  margin: ${e=>e.theme.spacing.lg} 0;
  border: 1px solid ${e=>e.theme.colors.border};

  code {
  background: none;
  padding: 0;
  border: none;
  }
  }

  blockquote {
  border-left: 4px solid ${e=>e.theme.colors.primary};
  padding-left: ${e=>e.theme.spacing.lg};
  margin: ${e=>e.theme.spacing.lg} 0;
  font-style: italic;
  color: ${e=>e.theme.colors.textMuted};
  background: ${e=>e.theme.colors.backgroundAlt};
  padding: ${e=>e.theme.spacing.md};
  border-radius: 0 8px 8px 0;
  }

  img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: ${e=>e.theme.spacing.lg} 0;
  box-shadow: ${e=>e.theme.shadows.medium};
  }

  table {
  width: 100%;
  border-collapse: collapse;
  margin: ${e=>e.theme.spacing.lg} 0;
  background: ${e=>e.theme.colors.backgroundAlt};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${e=>e.theme.colors.border};
  }

  th, td {
  padding: ${e=>e.theme.spacing.md};
  text-align: left;
  border-bottom: 1px solid ${e=>e.theme.colors.border};
  }

  th {
  background: ${e=>e.theme.colors.background};
  font-weight: 600;
  color: ${e=>e.theme.colors.primary};
  }

  @media (max-width: ${e=>e.theme.breakpoints.tablet}) {
  font-size: 1rem;

  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.6rem; }
  h3 { font-size: 1.4rem; }
  }
`,K=o.div`
  background: ${e=>e.theme.colors.backgroundAlt};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: 8px;
  margin: ${e=>e.theme.spacing.xl} 0;
  overflow: hidden;
  position: relative;

  &::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${e=>e.theme.colors.gradientText};
  }
`,Q=o.div`
  background: ${e=>e.theme.colors.background};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${e=>e.theme.colors.textMuted};
`,V=o.pre`
  background: ${e=>e.theme.colors.background};
  padding: ${e=>e.theme.spacing.lg};
  margin: 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${e=>e.theme.colors.text};
`,X=o.button`
  background: none;
  border: none;
  color: ${e=>e.theme.colors.primary};
  cursor: pointer;
  padding: ${e=>e.theme.spacing.xs};
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
  background: ${e=>e.theme.colors.backgroundAlt};
  color: ${e=>e.theme.colors.text};
  }

  i {
  font-size: 0.9rem;
  }
`,Z=o.div`
  text-align: center;
  padding: 2rem 0;
  @media (max-width: ${e=>e.theme.breakpoints.desktop}) {
    padding: 7rem 0 2rem!important;
  }
`,re=()=>{const{slug:e}=B(),z=P();S();const i=E.find(s=>s.slug===e),[m,x]=j.useState(!1),{t:a}=M(),$=()=>{z("/",{replace:!0}),setTimeout(()=>{const s=new CustomEvent("scrollToBlog");window.dispatchEvent(s)},100)};j.useEffect(()=>{i?document.title=`${i.title} - Daniel Neitzel`:document.title="Artigo não encontrado - Daniel Neitzel",window.scrollTo(0,0)},[i]);const k=async()=>{try{const s=window.location.href;await navigator.clipboard.writeText(s),x(!0),setTimeout(()=>{x(!1)},3e3)}catch(s){console.error("Erro ao copiar link:",s);const n=document.createElement("textarea");n.value=window.location.href,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n),x(!0),setTimeout(()=>{x(!1)},3e3)}};if(!i)return t.jsx(y,{children:t.jsx(w,{children:t.jsxs(Z,{children:[t.jsx(D,{$gradient:!0,children:a("articleNotFound")}),t.jsx(F,{children:a("articleNotFoundDesc")}),t.jsxs(v,{onClick:$,children:[t.jsx("i",{className:"fa fa-arrow-left"}),a("backToBlog")]})]})})});const T=s=>new Date(s).toLocaleDateString("pt-BR",{year:"numeric",month:"long",day:"numeric"}),A=s=>{const n=s.split(/(```[\s\S]*?```)/g),d=[];return n.forEach((g,h)=>{if(g.startsWith("```")&&g.endsWith("```")){const u=g.slice(3,-3).trim(),r=u.split(`
`),c=r[0]?.trim()||"",l=c.match(/^(\w+)$/)?c:"",b=l?r.slice(1).join(`
`):u;d.push(t.jsxs(K,{children:[t.jsxs(Q,{children:[t.jsx("span",{children:l||"Código"}),t.jsx(X,{onClick:()=>{navigator.clipboard.writeText(b)},title:"Copiar código",children:t.jsx("i",{className:"fa fa-copy"})})]}),t.jsx(V,{children:t.jsx("code",{children:b})})]},`code-${h}`))}else g.trim()&&g.split(`

`).filter(r=>r.trim()).forEach((r,c)=>{if(r.trim())if(r.startsWith("## ")){const l=r.replace(/^##\s/,"");d.push(t.jsx("h2",{children:l},`text-${h}-${c}`))}else if(r.startsWith("> "))d.push(t.jsx("blockquote",{children:r.replace(/^>\s?/,"")},`text-${h}-${c}`));else if(r.includes(`
- `)||/^\d+\.\s/.test(r.split(`
`)[0])){const l=r.split(`
`).filter(p=>p.trim());/^\d+\.\s/.test(l[0])?d.push(t.jsx("ol",{children:l.map((p,f)=>t.jsx("li",{children:p.replace(/^\d+\.\s/,"")},`item-${f}`))},`text-${h}-${c}`)):d.push(t.jsx("ul",{children:l.map((p,f)=>t.jsx("li",{children:p.replace(/^- /,"")},`item-${f}`))},`text-${h}-${c}`))}else d.push(t.jsx("p",{children:r},`text-${h}-${c}`))})}),d};return t.jsx(y,{children:t.jsx(w,{children:t.jsxs(N.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.6},children:[t.jsxs(v,{onClick:$,children:[t.jsx("i",{className:"fa fa-arrow-left"}),a("backToBlog")]}),t.jsxs(W,{children:[t.jsx(q,{src:i.image,alt:i.title}),t.jsx(H,{children:i.title}),t.jsxs(O,{children:[t.jsxs("span",{children:[t.jsx("i",{className:"fa fa-calendar"})," ",T(i.date)]}),t.jsxs("span",{children:[t.jsx("i",{className:"fa fa-clock"})," ",i.readTime]}),t.jsxs(R,{children:[t.jsx("i",{className:"fa fa-user"}),t.jsx("span",{children:i.author})]})]}),t.jsx(Y,{children:i.tags.map((s,n)=>t.jsx(U,{children:s},n))}),t.jsx("div",{style:{display:"flex",justifyContent:"center"},children:t.jsxs(C,{onClick:k,className:m?"copied":"",title:"Copiar link do artigo",children:[t.jsx("i",{className:m?"fa fa-check":"fa fa-share"}),a(m?"linkCopied":"shareArticle")]})})]}),t.jsxs(J,{children:[A(i.content),t.jsx(G,{children:t.jsxs(C,{onClick:k,className:m?"copied":"",title:"Copiar link do artigo",children:[t.jsx("i",{className:m?"fa fa-check":"fa fa-share"}),a(m?"linkCopied":"shareArticle")]})})]})]})})})};export{re as default};
