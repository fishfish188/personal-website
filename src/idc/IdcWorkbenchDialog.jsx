import React, { useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import IdcWorkbench from './IdcWorkbench';
import styles from './IdcWorkbench.module.css';

function OpenWorkbenchDialog({ target, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const body = document.body;
    const root = document.documentElement;
    const position = { left: window.scrollX, top: window.scrollY };
    const previous = { bodyOverflow: body.style.overflow, rootOverflow: root.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    if (scrollbarWidth > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('[data-idc-close]')?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      body.style.overflow = previous.bodyOverflow;
      root.style.overflow = previous.rootOverflow;
      body.style.paddingRight = previous.paddingRight;
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
      window.scrollTo({ ...position, behavior: 'instant' });
    };
  }, []);

  const keepFocusInside = (event) => {
    if (event.key !== 'Tab' || event.defaultPrevented || event.target.closest('dialog') !== dialogRef.current) return;
    const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((node) => node.tabIndex >= 0 && node.getClientRects().length && getComputedStyle(node).visibility === 'visible' && !node.closest('[inert]'));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} aria-modal="true"
      onCancel={(event) => { if (event.target === event.currentTarget) { event.preventDefault(); onClose(); } }} onKeyDown={keepFocusInside}>
      <IdcWorkbench target={target} onClose={onClose} titleId={titleId} />
    </dialog>, document.body,
  );
}

export default function IdcWorkbenchDialog({ open, target, onClose }) {
  return open ? <OpenWorkbenchDialog target={target} onClose={onClose} /> : null;
}
