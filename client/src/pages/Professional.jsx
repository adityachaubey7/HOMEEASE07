import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReviewCard, ServiceCard } from '@/components/service/ServiceCards';
import { Avatar, Button, ErrorNote, Icon, Skeleton, Stars } from '@/components/ui';
import { proApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { compact } from '@/utils/format';
import { categories } from '@shared/catalog.js';

export default function Professional() {
  const { proId } = useParams();
  const navigate = useNavigate();
  const { data: pro, loading, error, reload } = useAsync(() => proApi.get(proId), [proId]);

  if (error) return <div className="container page"><ErrorNote error={error} onRetry={reload} /></div>;
  if (loading || !pro) return <div className="container page"><Skeleton h={180} r={18} /><div style={{ height: 24 }} /><Skeleton h={300} r={14} /></div>;

  const cat = categories.find((c) => c.id === pro.categoryIds[0]);

  return (
    <div className="container page pro-page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><Icon name="right" size={14} /><Link to={`/c/${cat.id}`}>{cat.name}</Link><Icon name="right" size={14} /><span aria-current="page">{pro.name}</span></nav>

      <section className="pro-hero">
        <Avatar name={pro.name} tone={pro.tone} size={104} />
        <div className="pro-hero__main">
          <h1>{pro.name} <Icon name="verified" size={24} className="verified" label="Verified professional" /></h1>
          <p className="muted">{cat.short} specialist · {pro.area} · Speaks {pro.languages.join(', ')}</p>
          <ul className="badges">{pro.badges.map((b) => <li key={b} className="badge badge--outline">{b}</li>)}</ul>
        </div>
        <dl className="pro-stats">
          <div><dt>Rating</dt><dd><Icon name="star" filled size={18} className="rating__star" />{pro.rating}</dd></div>
          <div><dt>Jobs done</dt><dd className="tnum">{compact(pro.jobs)}</dd></div>
          <div><dt>Experience</dt><dd>{pro.years} yrs</dd></div>
        </dl>
        <div className="pro-hero__cta">
          <Button size="lg" onClick={() => navigate(`/c/${cat.id}`)}>Book {pro.name.split(' ')[0]}</Button>
          <span className="muted-xs">Add a service, then pick {pro.name.split(' ')[0]} at checkout.</span>
        </div>
      </section>

      <div className="pro-layout">
        <div className="pro-layout__main">
          <section className="svc-section">
            <h2>About</h2>
            <p className="prose">{pro.bio}</p>
            <h3 className="h-sm">Specialities</h3>
            <ul className="chips chips--static">{pro.skills.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
          </section>

          <section className="svc-section">
            <h2>Services {pro.name.split(' ')[0]} offers</h2>
            <div className="svc-grid svc-grid--3">{pro.services.slice(0, 6).map((s) => <ServiceCard key={s.id} service={s} />)}</div>
          </section>

          <section className="svc-section">
            <h2>Reviews</h2>
            {pro.reviews.length ? (
              <div className="review-list">{pro.reviews.map((r) => <ReviewCard key={r.id} review={r} serviceName={pro.services.find((s) => s.id === r.serviceId)?.name} />)}</div>
            ) : <p className="muted-sm">No written reviews yet.</p>}
          </section>
        </div>
        <aside className="pro-layout__side">
          <div className="trust-card">
            <h3>Checks completed</h3>
            <ul className="ticks">
              <li><Icon name="check" size={16} />Government ID verified</li>
              <li><Icon name="check" size={16} />Police background check</li>
              <li><Icon name="check" size={16} />Skills assessment passed</li>
              <li><Icon name="check" size={16} />Hygiene and safety training</li>
            </ul>
            <div className="trust-card__score">
              <Stars value={pro.rating} size={16} />
              <span className="muted-xs">Rated by {compact(Math.round(pro.jobs * 0.7))} customers</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
