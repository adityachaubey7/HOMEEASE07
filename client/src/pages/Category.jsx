import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProCard, RatingBreakdown, ReviewCard, ServiceRow } from '@/components/service/ServiceCards';
import { CartBar, CartPanel } from '@/components/booking/CartPanel';
import { Accordion, ErrorNote, Icon, Skeleton, Thumb } from '@/components/ui';
import { catalogApi, proApi, reviewApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { compact } from '@/utils/format';
import { services as allServices } from '@shared/catalog.js';

export default function Category() {
  const { categoryId } = useParams();
  const { data: cat, loading, error, reload } = useAsync(() => catalogApi.category(categoryId), [categoryId]);
  const pros = useAsync(() => proApi.list({ categoryId }), [categoryId]);
  const reviews = useAsync(() => reviewApi.list({ categoryId }), [categoryId]);
  const [activeSection, setActiveSection] = useState(null);

  // Scroll-spy for the section navigator.
  useEffect(() => {
    if (!cat) return;
    const els = cat.sections.map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActiveSection(vis.target.id.replace('sec-', ''));
    }, { rootMargin: '-120px 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cat]);

  if (error) return <div className="container page"><ErrorNote error={error} onRetry={reload} /><Link to="/" className="text-link">Back to home</Link></div>;
  if (loading || !cat) {
    return (
      <div className="container page">
        <Skeleton h={36} w="50%" /><div style={{ height: 12 }} /><Skeleton h={18} w="30%" />
        <div className="cat-layout" style={{ marginTop: 32 }}><Skeleton h={300} r={14} /><Skeleton h={600} r={14} /><Skeleton h={220} r={14} /></div>
      </div>
    );
  }

  const jump = (id) => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="container page category-page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><Icon name="right" size={14} /><Link to="/search">Services</Link><Icon name="right" size={14} /><span aria-current="page">{cat.name}</span></nav>

      <div className="cat-layout">
        {/* Left: header + section navigator */}
        <div className="cat-layout__nav">
          <header className="cat-hero">
            <h1>{cat.name}</h1>
            <p className="cat-hero__meta">
              <span className="rating rating--md"><Icon name="star" filled size={15} className="rating__star" /><strong>{cat.rating}</strong></span>
              <span className="muted-sm">{compact(cat.bookings)} bookings</span>
            </p>
            <p className="cat-hero__slot"><Icon name="clock" size={16} />Earliest slot: <strong>{cat.earliest}</strong></p>
            <p className="muted-sm">{cat.tagline}</p>
          </header>
          <div className="section-nav">
            <p className="section-nav__label">Select a service</p>
            <div className="section-nav__grid">
              {cat.sections.map((s) => (
                <button key={s.id} className={`section-nav__item ${activeSection === s.id ? 'is-active' : ''}`} onClick={() => jump(s.id)}>
                  <Thumb categoryId={cat.id} size="sm" />
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: services */}
        <div className="cat-layout__main">
          {cat.sections.map((sec) => (
            <section key={sec.id} id={`sec-${sec.id}`} className="svc-section" aria-labelledby={`h-${sec.id}`}>
              <h2 id={`h-${sec.id}`}>{sec.title}</h2>
              {cat.services.filter((s) => s.sectionId === sec.id).map((s) => <ServiceRow key={s.id} service={s} />)}
            </section>
          ))}

          {pros.data?.length > 0 && (
            <section className="svc-section">
              <h2>Professionals for {cat.short.toLowerCase()}</h2>
              <p className="muted-sm">All verified. You can request one of them at checkout, or let us match the nearest available.</p>
              <div className="pro-list">{pros.data.map((p) => <ProCard key={p.id} pro={p} categoryName={cat.short} />)}</div>
            </section>
          )}

          <section className="svc-section" aria-labelledby="reviews-h">
            <h2 id="reviews-h">Customer reviews</h2>
            <RatingBreakdown rating={cat.rating} total={Math.round(cat.bookings * 0.42)} />
            <div className="review-list">
              {reviews.data?.length ? reviews.data.map((r) => (
                <ReviewCard key={r.id} review={r} serviceName={allServices.find((s) => s.id === r.serviceId)?.name} />
              )) : !reviews.loading && <p className="muted-sm">Reviews for this category will appear here.</p>}
            </div>
          </section>

          <section className="svc-section" aria-labelledby="faq-h">
            <h2 id="faq-h">Frequently asked questions</h2>
            <Accordion items={cat.faqs} />
          </section>
        </div>

        {/* Right: cart + promise */}
        <div className="cat-layout__side">
          <CartPanel />
          <div className="promise-mini">
            <h3>HomeEase promise</h3>
            <ul>
              <li><Icon name="verified" size={18} />Verified professionals</li>
              <li><Icon name="rupee" size={18} />Fixed, upfront prices</li>
              <li><Icon name="shield" size={18} />₹10,000 damage cover</li>
              <li><Icon name="refresh" size={18} />Free 30-day revisit</li>
            </ul>
          </div>
        </div>
      </div>
      <CartBar />
    </div>
  );
}
