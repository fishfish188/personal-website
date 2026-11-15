import React, { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon';
export const WorkbenchContext = createContext(null);
export const useWorkbench = () => useContext(WorkbenchContext);
export function TextButton({ children, ...props }) { return <button type="button" className="text-button" {...props}>{children}</button>; }
export function Tag({ children }) { return <span className="tag">{children}</span>; }
export function Table({ headers, children, className = '', empty }) { const tableClassName = [className, headers.includes('操作') ? 'has-actions' : ''].filter(Boolean).join(' '); return <div className="tablewrap"><table className={tableClassName}><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}{empty && <tr><td colSpan={headers.length} className="product-empty">{empty}</td></tr>}</tbody></table></div>; }
export function Panel({ title, action, children, className = '' }) { return <section className={'panel ' + className}>{title && <div className="panel-title"><h3>{title}</h3>{action}</div>}{children}</section>; }
const optionValue = option => String(option?.value ?? option);
const optionLabel = option => String(option?.label ?? option);
export function SelectControl({ name, value, defaultValue, options, onChange, label, disabled = false }) {
  const initial = optionValue(options.find(option => optionValue(option) === String(defaultValue)) ?? options[0] ?? '');
  const [internalValue, setInternalValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedValue = value !== undefined ? String(value) : internalValue;
  const selected = options.find(option => optionValue(option) === selectedValue) ?? options[0];
  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = event => { if (!ref.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [open]);
  const choose = next => { if (value === undefined) setInternalValue(next); onChange?.(next); setOpen(false); };
  return <div ref={ref} className={'select-control custom-select' + (open ? ' is-open' : '')}>
    {name && <input type="hidden" name={name} value={selectedValue} />}
    <button type="button" className="select-trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} disabled={disabled} onClick={() => setOpen(current => !current)}><span>{selected ? optionLabel(selected) : ''}</span><Icon name="chevron" /></button>
    {open && <div className="select-menu" role="listbox" aria-label={label}>{options.map(option => { const next = optionValue(option), selectedOption = next === selectedValue; return <button type="button" role="option" aria-selected={selectedOption} className={'select-option' + (selectedOption ? ' selected' : '')} key={next} onClick={() => choose(next)}><span className="select-check" aria-hidden="true">{selectedOption ? '✓' : ''}</span><span>{optionLabel(option)}</span></button>; })}</div>}
  </div>;
}
export function Field({ label, name, value, options, type = 'text', full, ...props }) { const controlled = typeof props.onChange === 'function'; const fieldProps = controlled ? { ...props, value: value ?? '', autoComplete: props.autoComplete ?? 'off' } : { ...props, defaultValue: value, autoComplete: props.autoComplete ?? 'off' }; return <label className={full ? 'full' : ''}><span>{label}</span>{options ? <SelectControl name={name} defaultValue={value} options={options} label={label} disabled={props.disabled} /> : type === 'textarea' ? <textarea name={name} rows={3} maxLength={500} {...fieldProps} /> : <input name={name} type={type} {...fieldProps} />}</label>; }
export function Filter({ value, onChange, label, options }) { return <SelectControl value={value} onChange={onChange} label={label} options={options} />; }
export function Search({ value, onChange, placeholder }) { return <input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />; }
export function KV({ items }) { return <dl className="kv">{items.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value || '待确认'}</dd></React.Fragment>)}</dl>; }
export function Logs({ items = [] }) { return <ul className="log">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>; }
export function Modal({ title, subtitle, children, drawer = false, onClose }) {
  const ref = useRef(null), id = useId();
  useLayoutEffect(() => {
    const dialog = ref.current, previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={'idc-modal ' + (drawer ? 'idc-drawer' : '')} aria-labelledby={id} onCancel={e => { e.preventDefault(); e.stopPropagation(); onClose(); }}>
    <div className="dialoghead"><div>{subtitle && <small>{subtitle}</small>}<h2 id={id}>{title}</h2></div><button type="button" aria-label={'关闭' + title} onClick={onClose}>关闭 <Icon name="close" /></button></div>
    <div className="dialogbody">{children}</div>
  </dialog>;
}
export const allOption = label => ({ value: 'all', label });
export function ErrorText({ children }) { return children ? <p className="acceptance-error" role="alert">{children}</p> : null; }
export function Actions({ children }) { return <div className="actions divider">{children}</div>; }
export function formValues(event) { return Object.fromEntries(new FormData(event.currentTarget)); }
