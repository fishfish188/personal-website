import React from 'react';
const paths = {
  'chevron': <><path d="m7 10 5 5 5-5"/></>,
  'reset': <><path d="M20 7a9 9 0 0 0-15-2L2 8m0-6v6h6M4 17a9 9 0 0 0 15 2l3-3m0 6v-6h-6"/></>,
  'arrow': <><path d="M14 6l6 6-6 6"/></>,
  'home': <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></>,
  'doc': <><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/></>,
  'shield': <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6"/></>,
  'server': <><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></>,
  'layers': <><path d="m12 3 10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6"/></>,
  'info': <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/></>,
  'close': <><path d="m6 6 12 12M6 18 18 6"/></>,
  'analysis': <><path d="M4 20V4M4 20h17M8 16v-5m5 5V7m5 9V4"/></>,
  'menu': <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  'monitor': <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  'link': <><path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15"/><path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15"/></>,
};
export default function Icon({ name, className = '' }) { return <svg className={'icon ' + className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.doc}</svg>; }
