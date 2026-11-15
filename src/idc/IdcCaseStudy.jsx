import React, { lazy, Suspense, useState } from 'react';
import { idcCaseSections } from './caseStudyLayout';
import './idcCaseStudy.css';

const IdcWorkbenchDialog = lazy(() => import('./IdcWorkbenchDialog'));

const artwork = import.meta.glob('./case-assets/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
});

function CaseLayer({ layer, section = false }) {
  const { id, name, box: [left, top, width, height], style, asset, src, alt, heading, text, items, children } = layer;
  const props = {
    className: 'idc-case-layer',
    'data-layer': name,
    style: { left, top, width, height, ...style },
  };

  if (asset) return <img {...props} src={artwork[`./case-assets/${asset}.svg`]} alt="" draggable="false" />;
  if (src) {
    return <img {...props} className="idc-case-layer idc-case-image" src={src} alt={alt} loading="lazy" decoding="async" draggable="false" />;
  }
  if (items) return <ul {...props}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
  if (text) {
    const Tag = heading ? `h${heading}` : 'p';
    return <Tag {...props} id={heading === 2 ? `idc-case-${id}` : undefined}>{text}</Tag>;
  }

  const Tag = section ? 'section' : 'div';
  const title = section && (children.find((child) => child.heading === 2) ||
    children[0].children?.find((child) => child.heading === 2));
  return (
    <Tag {...props} aria-labelledby={title ? `idc-case-${title.id}` : undefined}>
      {children?.map((child) => <CaseLayer key={child.id} layer={child} />)}
    </Tag>
  );
}

export default function IdcCaseStudy({ coverSrc }) {
  const [workbenchOpen, setWorkbenchOpen] = useState(false);

  return (
    <article className="idc-case-frame" lang="zh-CN">
      <header className="idc-case-cover" data-layer="idc-top-bg">
        {coverSrc && <img src={coverSrc} alt="" draggable="false" />}
        <h1 id="idc-case-title" className={coverSrc ? 'idc-case-cover-title-hidden' : undefined}>IDC产品运营项目</h1>
      </header>
      {idcCaseSections.map((layer) => <CaseLayer key={layer.id} layer={layer} section />)}
      <div className="idc-case-workbench-entry">
        <button
          className="idc-case-workbench-button"
          type="button"
          aria-label="查看 IDC 运营工作台"
          aria-haspopup="dialog"
          onClick={() => setWorkbenchOpen(true)}
        >
          <img src="https://hardhardfish.dpdns.org/float.png" width="139" height="124" alt="" draggable="false" />
        </button>
      </div>
      {workbenchOpen && (
        <Suspense fallback={null}>
          <IdcWorkbenchDialog open onClose={() => setWorkbenchOpen(false)} />
        </Suspense>
      )}
    </article>
  );
}
