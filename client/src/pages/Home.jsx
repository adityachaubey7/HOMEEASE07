import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from '@/components/layout/SearchBox';
import RoomExplorer from '@/components/home/RoomExplorer';
import { ProCard, ReviewCard, ServiceCard } from '@/components/service/ServiceCards';
import { Icon, Skeleton, Thumb } from '@/components/ui';
import { catalogApi, proApi, reviewApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useLocationPref } from '@/context/AppProviders';
import { cities, services as allServices, professionals } from '@shared/catalog.js';
import { inr } from '@/utils/format';

const GROUPS = [
  { id: 'home', title: 'Cleaning & care' },
  { id: 'repair', title: 'Repairs & installation' },
  { id: 'beauty', title: 'Beauty & grooming' },
];

function Carousel({ children, label }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' });
  return (
    <div className="carousel">
      <div className="carousel__track" ref={ref} role="list" aria-label={label}>{children}</div>
      <div className="carousel__ctrl">
        <button className="icon-btn icon-btn--outline" onClick={() => scroll(-1)} aria-label="Scroll back"><Icon name="left" /></button>
        <button className="icon-btn icon-btn--outline" onClick={() => scroll(1)} aria-label="Scroll forward"><Icon name="right" /></button>
      </div>
    </div>
  );
}

export default function Home() {
  const { city } = useLocationPref();
  const cityName = cities.find((c) => c.id === city)?.name;
  const cats = useAsync(() => catalogApi.categories(), []);
  const popular = useAsync(() => catalogApi.services({ sort: 'popular' }), []);
  const pros = useAsync(() => proApi.list({ limit: 6 }), []);
  const reviews = useAsync(() => reviewApi.list({ limit: 6 }), []);
  const catName = (id) => cats.data?.find((c) => c.id === id)?.short || '';

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1>Every room in your home, looked after by people you can trust.</h1>
            <p className="hero__lede">Book verified professionals for cleaning, repairs and grooming in {cityName}. You see the fixed price before you book, and HomeEase Cover stands behind every visit.</p>
            <SearchBox size="lg" />
            <ul className="hero__proof">
              <li><Icon name="star" filled size={16} className="rating__star" /><strong>4.8</strong> average across 12M+ bookings</li>
              <li><Icon name="verified" size={16} />Background-checked professionals</li>
              <li><Icon name="refresh" size={16} />Free revisit within 30 days</li>
            </ul>
          </div>
          <RoomExplorer />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" aria-labelledby="cats-h">
        <div className="container">
          <div className="section__head">
            <h2 id="cats-h">What do you need help with?</h2>
            <Link to="/search" className="text-link">All services<Icon name="right" size={16} /></Link>
          </div>
          <div className="cat-groups">
            {GROUPS.map((g) => (
              <div className="cat-group" key={g.id}>
                <h3 className="cat-group__title">{g.title}</h3>
                <div className="cat-grid">
                  {cats.loading && [1, 2, 3].map((i) => <Skeleton key={i} h={132} r={14} />)}
                  {cats.data?.filter((c) => c.group === g.id).map((c) => (
                    <Link key={c.id} to={`/c/${c.id}`} className="cat-tile">
                      <Thumb categoryId={c.id} size="sm" />
                      <span className="cat-tile__name">{c.short}</span>
                      <span className="cat-tile__from">from {inr(c.startsAt)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOST BOOKED */}
      <section className="section section--tint" aria-labelledby="popular-h">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 id="popular-h">Most booked in {cityName}</h2>
              <p className="section__sub">What your neighbours booked this week, with today’s prices.</p>
            </div>
          </div>
          <Carousel label="Most booked services">
            {popular.loading && [1, 2, 3, 4].map((i) => <div className="carousel__item" key={i}><Skeleton h={280} r={14} /></div>)}
            {popular.data?.slice(0, 10).map((s) => (
              <div className="carousel__item" role="listitem" key={s.id}><ServiceCard service={s} categoryName={catName(s.categoryId)} /></div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* PROMISE */}
      <section className="section" id="cover" aria-labelledby="cover-h">
        <div className="container promise">
          <div className="promise__lead">
            <h2 id="cover-h">The HomeEase promise</h2>
            <p>Four commitments that come with every booking, whatever the job.</p>
            <div className="cover-card">
              <Icon name="shield" size={30} />
              <div>
                <strong>HomeEase Cover</strong>
                <p>Up to ₹10,000 if anything is damaged during a service, and a free revisit if the work isn’t right.</p>
              </div>
            </div>
          </div>
          <ul className="promise__list">
            <li><Icon name="rupee" size={24} /><div><h3>Price fixed before you book</h3><p>The price in your cart is the price you pay. Spare parts follow a published rate card.</p></div></li>
            <li><Icon name="verified" size={24} /><div><h3>Verified and trained</h3><p>ID, address and police checks, plus a skills test and on-the-job training for every professional.</p></div></li>
            <li><Icon name="toolbox" size={24} /><div><h3>Fully equipped</h3><p>Professionals arrive with tools, machines and single-use kits. You only provide water and power.</p></div></li>
            <li><Icon name="clock" size={24} /><div><h3>On time, or ₹100 back</h3><p>Live arrival tracking. If your professional is more than 15 minutes late, we credit your wallet.</p></div></li>
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS (a real sequence, so it is numbered) */}
      <section className="section section--tint" aria-labelledby="how-h">
        <div className="container">
          <div className="section__head"><h2 id="how-h">Booking takes about a minute</h2></div>
          <ol className="steps">
            <li><span className="steps__n">1</span><h3>Pick a service</h3><p>Browse by category or by room. Every service lists what’s included and what isn’t.</p></li>
            <li><span className="steps__n">2</span><h3>Choose a slot</h3><p>Slots from 8 AM to 8 PM, seven days a week. Choose a professional or let us match one.</p></li>
            <li><span className="steps__n">3</span><h3>Relax at home</h3><p>Track arrival, share the start code, and pay after the job if you prefer.</p></li>
          </ol>
        </div>
      </section>

      {/* PROFESSIONALS */}
      <section className="section" aria-labelledby="pros-h">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 id="pros-h">Top-rated professionals near you</h2>
              <p className="section__sub">Request someone you like by name when you book.</p>
            </div>
          </div>
          <div className="pro-grid">
            {pros.loading && [1, 2, 3].map((i) => <Skeleton key={i} h={96} r={14} />)}
            {pros.data?.map((p) => <ProCard key={p.id} pro={p} categoryName={catName(p.categoryIds[0])} />)}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section--tint" aria-labelledby="rev-h">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 id="rev-h">Recent reviews</h2>
              <p className="section__sub">Unedited, from verified bookings in the last two weeks.</p>
            </div>
          </div>
          <div className="review-grid">
            {reviews.data?.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                serviceName={allServices.find((s) => s.id === r.serviceId)?.name}
                showPro
                proName={professionals.find((p) => p.id === r.proId)?.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section className="section">
        <div className="container join-band">
          <div>
            <h2>Are you a skilled professional?</h2>
            <p>Get steady work near your home, weekly payouts and free training. 48,000 professionals already earn with HomeEase.</p>
          </div>
          <Link to="/join" className="btn btn--light btn--lg">Join as a professional</Link>
        </div>
      </section>
    </>
  );
}
