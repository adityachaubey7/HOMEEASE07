import { useState } from 'react';
import { Button, Icon } from '@/components/ui';
import { categories, cities } from '@shared/catalog.js';
import { useToast } from '@/context/AppProviders';

export default function JoinPro() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', phone: '', city: cities[0].id, skill: categories[0].id, years: '2' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return setErr('Enter your full name.');
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setErr('Enter a 10-digit mobile number.');
    setErr(''); setSent(true); toast('Application received', 'success');
  }

  return (
    <div className="container page join-page">
      <div className="join-page__copy">
        <h1>Earn on your own schedule with HomeEase</h1>
        <p className="lede">Choose the areas and hours you work. We bring the customers, the training and the insurance.</p>
        <ul className="promise__list promise__list--compact">
          <li><Icon name="wallet" size={22} /><div><h3>Weekly payouts</h3><p>Earnings land in your bank every Tuesday, with a clear breakdown per job.</p></div></li>
          <li><Icon name="toolbox" size={22} /><div><h3>Training and kits</h3><p>Free skill courses and branded kits at partner rates.</p></div></li>
          <li><Icon name="shield" size={22} /><div><h3>Insurance</h3><p>Accident and health cover for you and your family.</p></div></li>
        </ul>
      </div>
      <div className="panel join-page__form">
        {sent ? (
          <div className="empty">
            <span className="empty__icon"><Icon name="check" size={28} /></span>
            <h3>Thanks, {form.name.split(' ')[0]}</h3>
            <p>Our onboarding team will call +91 {form.phone} within 2 working days to schedule your skills test.</p>
          </div>
        ) : (
          <form className="form" onSubmit={submit} noValidate>
            <h2>Apply in 2 minutes</h2>
            <label className="field"><span className="field__label">Full name</span><input id="jp-name" value={form.name} onChange={up('name')} /></label>
            <label className="field"><span className="field__label">Mobile number</span>
              <span className="field__phone"><span className="field__prefix">+91</span><input id="jp-phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} /></span>
            </label>
            <label className="field"><span className="field__label">City</span>
              <span className="select select--field"><select id="jp-city" value={form.city} onChange={up('city')}>{cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><Icon name="down" size={16} /></span>
            </label>
            <label className="field"><span className="field__label">Main skill</span>
              <span className="select select--field"><select id="jp-skill" value={form.skill} onChange={up('skill')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.short}</option>)}</select><Icon name="down" size={16} /></span>
            </label>
            <label className="field"><span className="field__label">Years of experience</span>
              <span className="select select--field"><select id="jp-years" value={form.years} onChange={up('years')}>{['Less than 1', '1', '2', '3–5', '6–10', 'More than 10'].map((y) => <option key={y}>{y}</option>)}</select><Icon name="down" size={16} /></span>
            </label>
            {err && <p className="field__error" role="alert">{err}</p>}
            <Button type="submit" block size="lg">Submit application</Button>
          </form>
        )}
      </div>
    </div>
  );
}
