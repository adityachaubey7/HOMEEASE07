import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AddToCart, Avatar, Button, Icon, Modal, Price, Rating, Stars, Thumb } from '@/components/ui';
import { compact, discountPct, duration, prettyDate } from '@/utils/format';

/** Compact vertical card for carousels and search results. */
export function ServiceCard({ service, categoryName }) {
  const off = discountPct(service.price, service.mrp);
  return (
    <article className="svc-card">
      <Link to={`/c/${service.categoryId}#${service.id}`} className="svc-card__media" tabIndex={-1} aria-hidden="true">
        <Thumb categoryId={service.categoryId} />
        {off >= 10 && <span className="badge badge--deal">{off}% off</span>}
      </Link>
      <div className="svc-card__body">
        {categoryName && <span className="svc-card__cat">{categoryName}</span>}
        <h3><Link to={`/c/${service.categoryId}#${service.id}`}>{service.name}</Link></h3>
        <Rating value={service.rating} count={service.reviewCount} size="sm" />
        <div className="svc-card__foot">
          <span className="svc-card__meta">
            <Price price={service.price} mrp={service.mrp} quote={service.quote} size="sm" />
            <span className="muted-xs"><Icon name="clock" size={13} />{duration(service.durationMins)}</span>
          </span>
          <AddToCart service={service} compact />
        </div>
      </div>
    </article>
  );
}

/** Detailed row used on the category page: what's included, price, add. */
export function ServiceRow({ service }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="svc-row" id={service.id}>
      <div className="svc-row__info">
        {service.popular && <span className="badge badge--brand">Most booked</span>}
        <h3>{service.name}</h3>
        <Rating value={service.rating} count={service.reviewCount} size="sm" />
        <div className="svc-row__price">
          <Price price={service.price} mrp={service.mrp} quote={service.quote} />
          <span className="dot-sep" aria-hidden="true" />
          <span className="muted-sm">{duration(service.durationMins)}</span>
          {service.perUnit && <span className="pill">{service.perUnit}</span>}
        </div>
        <ul className="ticks">
          {service.includes.slice(0, 2).map((i) => <li key={i}><Icon name="check" size={15} />{i}</li>)}
        </ul>
        <button className="link-btn" onClick={() => setOpen(true)}>View details</button>
      </div>
      <div className="svc-row__side">
        <Thumb categoryId={service.categoryId} />
        <AddToCart service={service} />
      </div>
      <ServiceDetailModal service={service} open={open} onClose={() => setOpen(false)} />
    </article>
  );
}

export function ServiceDetailModal({ service, open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={service.name}
      footer={<div className="modal__foot-row"><Price price={service.price} mrp={service.mrp} quote={service.quote} /><AddToCart service={service} /></div>}
    >
      <div className="detail">
        <Thumb categoryId={service.categoryId} size="lg" />
        <div className="detail__meta">
          <Rating value={service.rating} count={service.reviewCount} />
          <span className="muted-sm"><Icon name="clock" size={15} />{duration(service.durationMins)}</span>
        </div>
        <h4>What’s included</h4>
        <ul className="ticks">{service.includes.map((i) => <li key={i}><Icon name="check" size={15} />{i}</li>)}</ul>
        {service.excludes && (
          <>
            <h4>Not included</h4>
            <ul className="crosses">{service.excludes.map((i) => <li key={i}><Icon name="x" size={14} />{i}</li>)}</ul>
          </>
        )}
        <div className="cover-note">
          <Icon name="shield" size={22} />
          <p><strong>HomeEase Cover</strong> Up to ₹10,000 damage protection and a free revisit if anything isn’t right.</p>
        </div>
      </div>
    </Modal>
  );
}

export function ProCard({ pro, categoryName }) {
  return (
    <Link to={`/pro/${pro.id}`} className="pro-card">
      <Avatar name={pro.name} tone={pro.tone} size={56} />
      <div className="pro-card__body">
        <h3>{pro.name} <Icon name="verified" size={17} className="verified" label="Verified" /></h3>
        <p className="muted-sm">{categoryName} · {pro.years} yrs experience</p>
        <div className="pro-card__stats">
          <Rating value={pro.rating} size="sm" />
          <span className="muted-xs">{compact(pro.jobs)} jobs</span>
        </div>
      </div>
      <Icon name="right" size={18} className="pro-card__arrow" />
    </Link>
  );
}

export function ReviewCard({ review, serviceName, showPro, proName }) {
  return (
    <article className="review-card">
      <header>
        <Avatar name={review.author} tone="mint" size={36} />
        <div>
          <strong>{review.author}</strong>
          <span className="muted-xs">{prettyDate(review.date, { month: 'short', day: 'numeric', year: 'numeric' })} · {review.area}</span>
        </div>
        <span className={`review-card__score ${review.rating < 4 ? 'is-low' : ''}`}><Icon name="star" filled size={13} />{review.rating}</span>
      </header>
      <p>{review.text}</p>
      {(serviceName || showPro) && (
        <footer className="muted-xs">
          {serviceName}{showPro && proName ? ` · by ${proName}` : ''}
        </footer>
      )}
    </article>
  );
}

export function RatingBreakdown({ rating, total, reviews }) {
  const dist = [5, 4, 3, 2, 1].map((n) => {
    const share = { 5: 0.86, 4: 0.09, 3: 0.025, 2: 0.01, 1: 0.015 }[n];
    return { n, count: Math.round(total * share), share };
  });
  return (
    <div className="breakdown">
      <div className="breakdown__score">
        <strong>{rating.toFixed(2)}</strong>
        <Stars value={rating} size={18} />
        <span className="muted-sm">{compact(total)} reviews</span>
      </div>
      <ul>
        {dist.map((d) => (
          <li key={d.n}>
            <span>{d.n}<Icon name="star" filled size={12} /></span>
            <span className="bar"><span style={{ width: `${d.share * 100}%` }} /></span>
            <span className="muted-xs tnum">{compact(d.count)}</span>
          </li>
        ))}
      </ul>
      {reviews && null}
    </div>
  );
}

export { Button };
