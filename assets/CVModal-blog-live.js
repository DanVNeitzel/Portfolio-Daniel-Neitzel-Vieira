import{j as o,m as r}from"./motion-_9VZG8uU.js";import{u as s}from"./index-blog-live.js";import{d as t}from"./styled-Fec-KKY9.js";import"./router-DDemUlEg.js";import"./vendor-Bzgz95E1.js";const d=t(r.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.theme.colors.overlayDark};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: ${e=>e.theme.spacing.md};
`,l=t(r.div)`
  background: ${e=>e.theme.colors.background};
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  box-shadow: ${e=>e.theme.shadows.strong};
  border: 1px solid ${e=>e.theme.colors.border};
`,c=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${e=>e.theme.spacing.lg};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
`,m=t.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.colors.text};
  margin: 0;
`,p=t.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${e=>e.theme.colors.textMuted};
  padding: ${e=>e.theme.spacing.sm};
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${e=>e.theme.colors.text};
    background: ${e=>e.theme.colors.backgroundAlt};
  }
`,h=t.button`
  background: ${e=>e.theme.colors.primary};
  color: ${e=>e.theme.colors.background};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.colors.secondary};
    transform: translateY(-1px);
  }
`,g=t.div`
  padding: ${e=>e.theme.spacing.lg};

  iframe {
    width: 100%;
    height: 70vh;
    border: none;
    border-radius: 4px;
  }
`,k=({isOpen:e,onClose:i})=>{const{t:n}=s();return e?o.jsx(d,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:i,children:o.jsxs(l,{onClick:a=>a.stopPropagation(),initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.8,opacity:0},transition:{type:"spring",damping:25,stiffness:300},children:[o.jsxs(c,{children:[o.jsxs(m,{children:[o.jsx(p,{style:{position:"absolute",top:".8rem",right:"1rem"},onClick:i,children:"✕"}),n("cvTitle")]}),o.jsx(h,{onClick:()=>window.open(new URL("../CV%20-%20Daniel%20Neitzel%20Vieira.pdf",import.meta.url).href,"_blank"),children:n("openNewTab")})]}),o.jsx(g,{children:o.jsx("iframe",{src:new URL("../CV%20-%20Daniel%20Neitzel%20Vieira.pdf",import.meta.url).href,title:"Currículo Daniel Neitzel Vieira"})})]})}):null};export{k as default};
