import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Thumb } from '@/components/ui';
import { catalogApi } from '@/services/api';
import { useDebounced } from '@/hooks/useAsync';
import { inr } from '@/utils/format';

const POPULAR = ['AC service', 'Bathroom cleaning', 'Fan installation', 'Haircut', 'Cockroach control', 'Sofa cleaning'];

/** Search field with live suggestions (categories + services) and full keyboard support. */
export default function SearchBox({ size = 'md', autoFocus, placeholder = 'Search for “AC service” or “plumber”' }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState({ services: [], categories: [] });
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(q, 180);
  const wrap = useRef(null);
  const listId = useId();

  useEffect(() => {
    let live = true;
    if (!debounced.trim()) { setResults({ services: [], categories: [] }); return; }
    Promise.all([catalogApi.services({ q: debounced }), catalogApi.categories()]).then(([services, cats]) => {
      if (!live) return;
      const t = debounced.toLowerCase();
      setResults({
        services: services.slice(0, 5),
        categories: cats.filter((c) => c.name.toLowerCase().includes(t) || c.short.toLowerCase().includes(t)).slice(0, 2),
      });
      setActive(-1);
    });
    return () => { live = false; };
  }, [debounced]);

  useEffect(() => {
    const onDoc = (e) => !wrap.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const options = useMemo(() => {
    if (!q.trim()) return POPULAR.map((p) => ({ type: 'popular', label: p, go: () => goSearch(p) }));
    return [
      ...results.categories.map((c) => ({ type: 'category', label: c.name, sub: `${c.serviceCount} services`, categoryId: c.id, go: () => navigate(`/c/${c.id}`) })),
      ...results.services.map((s) => ({ type: 'service', label: s.name, sub: s.quote ? 'Free inspection' : `From ${inr(s.price)}`, categoryId: s.categoryId, go: () => navigate(`/c/${s.categoryId}#${s.id}`) })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, results]);

  function goSearch(term) {
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && options[active]) { options[active].go(); setOpen(false); }
      else if (q.trim()) goSearch(q.trim());
    } else if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className={`searchbox searchbox--${size} ${open ? 'is-open' : ''}`} ref={wrap}>
      <label className="searchbox__field">
        <Icon name="search" size={size === 'lg' ? 22 : 18} />
        <span className="sr-only">Search services</span>
        <input
          type="search"
          id={`search-${size}`}
          value={q}
          autoFocus={autoFocus}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onKeyDown={onKeyDown}
        />
        {q && <button type="button" className="icon-btn icon-btn--sm" onClick={() => setQ('')} aria-label="Clear search"><Icon name="x" size={16} /></button>}
      </label>
      {open && (
        <div className="searchbox__panel" id={listId} role="listbox">
          {!q.trim() && <p className="searchbox__heading">Popular right now</p>}
          {q.trim() && options.length === 0 && debounced === q && (
            <p className="searchbox__none">No services match “{q}”. Try a simpler word like “clean” or “repair”.</p>
          )}
          <ul className={!q.trim() ? 'searchbox__chips' : 'searchbox__list'}>
            {options.map((o, i) => (
              <li key={o.type + o.label} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
                <button type="button" className={active === i ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onClick={() => { o.go(); setOpen(false); }}>
                  {o.type === 'popular' ? (
                    <><Icon name="search" size={14} />{o.label}</>
                  ) : (
                    <>
                      <Thumb categoryId={o.categoryId} size="sm" />
                      <span className="searchbox__text"><strong>{o.label}</strong><small>{o.type === 'category' ? 'Category · ' : ''}{o.sub}</small></span>
                      <Icon name="right" size={16} />
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {q.trim() && options.length > 0 && (
            <button className="searchbox__all" type="button" onClick={() => goSearch(q.trim())}>See all results for “{q}”</button>
          )}
        </div>
      )}
    </div>
  );
}
