import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import IdcWorkbenchDialog from './IdcWorkbenchDialog';
import styles from './preview.module.css';

const search = new URLSearchParams(window.location.search);
const target = { pageId: search.get('page') || 'overview', recordId: search.get('record') };

function WorkbenchPreview() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    triggerRef.current.focus();
    setOpen(true);
  }, []);

  return <div className={styles.preview}>
    <a className={styles.back} href="/#about-ai">个人作品集</a>
    <main className={styles.launcher}>
      <h1>IDC 产品运营工作台</h1>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>打开工作台</button>
    </main>
    <IdcWorkbenchDialog open={open} target={target} onClose={() => setOpen(false)} />
  </div>;
}

createRoot(document.getElementById('root')).render(<WorkbenchPreview />);
