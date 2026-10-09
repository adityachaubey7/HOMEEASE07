import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBox from '@/components/layout/SearchBox';
import { ServiceCard } from '@/components/service/ServiceCards';
import { Button, Chip, EmptyState, ErrorNote, Icon, Skeleton } from '@/components/ui';
import { catalogApi } from '@/services/api';
import { useAsync, useMediaQuery } from '@/hooks/useAsync';
import { categories } from '@shared/catalog.js';
import { inr } from '@/utils/format';

const SORTS = [
  { id: 'popular', label: 'Most booked' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];
const PRICE_STEPS = [500, 1000, 2000, 5000, 8000];
const DURATIONS = [{ v: 60, l: 'Up to 1 hr' }, { v: 120, l: 'Up to 2 hrs' }, { v: '', l: 'Any length' }];

function Filters({ params, set, clear, activeCount }) {
  const cats = (params.get('cat') || '').split(',').filter(Boolean);
  const toggleCat = (id) => set('cat', (cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id]).join(','));
  const maxPrice = params.get('price') || '';
  return (
    <div className="filters">
      <div className="filters__head">
        <h2>Filters</h2>
        {activeCount > 0 && <button className="link-btn" onClick={clear}>Clear all</button>}
      </div>
      <fieldset>
        <legend>Category</legend>
        <div className="checks">
          {categories.map((c) => (
            <label key={c.id} className="check">
              <input type="checkbox" id={`f-cat-${c.id}`} checked={cats.includes(c.id)} onChange={() => toggleCat(c.id)} />
              <span className="check__box"><Icon name="check" size={14} /></span>
              {c.short}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Customer rating</legend>
        <div className="chips">
          {['4.7', '4.8'].map((r) => (
            <Chip key={r} active={params.get('rating') === r} onClick={() => set('rating', params.get('rating') === r ? '' : r)}>
              <Icon name="star" filled size={13} />{r}+
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Price up to <strong className="tnum">{maxPrice ? inr(maxPrice) : 'any'}</strong></legend>
        <input
          id="f-price"
          type="range"
          min={0}
          max={PRICE_STEPS.length}
          step={1}
          value={maxPrice ? PRICE_STEPS.indexOf(Number(maxPrice)) : PRICE_STEPS.length}
          onChange={(e) => set('price', Number(e.target.value) === PRICE_STEPS.length ? '' : PRICE_STEPS[Number(e.target.value)])}
          aria-valuetext={maxPrice ? inr(maxPrice) : 'Any price'}
        />
        <div className="range-labels muted-xs"><span>{inr(500)}</span><span>Any</span></div>
      </fieldset>
      <fieldset>
        <legend>Time at home</legend>
        <div className="chips">
          {DURATIONS.map((d) => (
            <Chip key={d.l} active={(params.get('duration') || '') === String(d.v)} onClick={() => set('duration', d.v)}>{d.l}</Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [sheet, setSheet] = useState(false);
  const isWide = useMediaQuery('(min-width: 900px)');
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'popular';

  const query = {
    q, sort,
    categoryId: params.get('cat') || undefined,
    minRating: params.get('rating') || undefined,
    maxPrice: params.get('price') || undefined,
    maxDuration: params.get('duration') || undefined,
  };
  const { data, loading, error, reload } = useAsync(() => catalogApi.services(query), [params.toString()]);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    value === '' || value === undefined ? next.delete(key) : next.set(key, value);
    setParams(next, { replace: true });
  };
  const clear = () => setParams(q ? { q } : {}, { replace: true });
  const activeCount = ['cat', 'rating', 'price', 'duration'].filter((k) => params.get(k)).length;
  const catName = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.short])), []);

  return (
    <div className="container page search-page">
      <header className="page-head">
        <h1>{q ? <>Results for “{q}”</> : 'All services'}</h1>
        <div className="search-page__box"><SearchBox size="md" placeholder="Search again" /></div>
      </header>

      <div className="search-layout">
        {isWide ? (
          <aside className="search-layout__side"><Filters params={params} set={set} clear={clear} activeCount={activeCount} /></aside>
        ) : (
          sheet && (
            <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && setSheet(false)}>
              <div className="sheet" role="dialog" aria-modal="true" aria-label="Filters">
                <Filters params={params} set={set} clear={clear} activeCount={activeCount} />
                <Button block onClick={() => setSheet(false)}>Show {data?.length ?? ''} results</Button>
              </div>
            </div>
          )
        )}

        <section className="search-layout__main" aria-live="polite">
          <div className="results-bar">
            <p className="muted-sm">{loading ? 'Searching…' : `${data?.length || 0} service${data?.length === 1 ? '' : 's'}`}</p>
            <div className="results-bar__ctrls">
              {!isWide && (
                <button className="btn btn--outline btn--sm" onClick={() => setSheet(true)}>
                  <Icon name="filter" size={16} />Filters{activeCount ? ` (${activeCount})` : ''}
                </button>
              )}
              <label className="select">
                <span className="sr-only">Sort by</span>
                <select id="sort" value={sort} onChange={(e) => set('sort', e.target.value)}>
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <Icon name="down" size={16} />
              </label>
            </div>
          </div>

          {error && <ErrorNote error={error} onRetry={reload} />}
          {loading && <div className="svc-grid">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} h={290} r={14} />)}</div>}
          {!loading && data?.length === 0 && (
            <EmptyState title="No services match these filters" action={<Button variant="outline" onClick={clear}>Clear filters</Button>}>
              Try a higher price limit or a broader search term.
            </EmptyState>
          )}
          {!loading && data?.length > 0 && (
            <div className="svc-grid">
              {data.map((s) => <ServiceCard key={s.id} service={s} categoryName={catName[s.categoryId]} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
