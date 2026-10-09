import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface Option { value: string; label: string; detail?: string }
interface Props { label: string; value: string; options: Option[]; onChange: (value: string) => void }

export default function SelectMenu({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ side: 'down', maxHeight: 320 });
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const selected = options.find(option => option.value === value)!;

  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const bounds = trigger.current!.getBoundingClientRect();
      const dialog = trigger.current!.closest('dialog')?.getBoundingClientRect();
      const viewportHeight = document.documentElement.clientHeight;
      const below = Math.min(viewportHeight, dialog?.bottom ?? viewportHeight) - bounds.bottom - 16;
      const above = bounds.top - Math.max(0, dialog?.top ?? 0) - 16;
      const upwards = below < Math.min(list.current!.scrollHeight, 260) && above > below;
      setPlacement({ side: upwards ? 'up' : 'down', maxHeight: Math.max(44, upwards ? above : below) });
    };
    position();
    window.addEventListener('resize', position);
    document.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      document.removeEventListener('scroll', position, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selectedOption = list.current!.querySelector<HTMLButtonElement>('[aria-selected="true"]')!;
    focusOption(selectedOption);
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function focusOption(button: HTMLButtonElement) {
    button.focus({ preventScroll: true });
    const menu = list.current!;
    const bottom = button.offsetTop + button.offsetHeight;
    if (button.offsetTop < menu.scrollTop) menu.scrollTop = button.offsetTop;
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  }

  return (
    <div className="select-menu" ref={root} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={trigger} className="select-trigger" role="combobox" aria-label={label}
        aria-expanded={open} aria-controls={id} aria-haspopup="listbox"
        onClick={() => setOpen(!open)} onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); }
          if (event.key === 'Escape') close();
        }}>
        <span>{selected.label}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && <div id={id} ref={list} className="select-options" role="listbox" aria-label={label}
        data-side={placement.side} style={{ maxHeight: placement.maxHeight }}
        onKeyDown={event => {
          const buttons = Array.from(list.current!.querySelectorAll<HTMLButtonElement>('[role="option"]'));
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          let next = index;
          if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
          else if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = buttons.length - 1;
          else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
          else return;
          event.preventDefault(); focusOption(buttons[next]);
        }}>
        <p className="select-caption" aria-hidden="true">{label}</p>
        {options.map(option => <button key={option.value} role="option" aria-selected={value === option.value}
          tabIndex={value === option.value ? 0 : -1} className="select-option"
          onClick={() => { onChange(option.value); close(); }}>
          <span className="option-check">{value === option.value && <Check size={14} aria-hidden="true" />}</span>
          <span>{option.label}</span>{option.detail && <small>{option.detail}</small>}
        </button>)}
      </div>}
    </div>
  );
}
