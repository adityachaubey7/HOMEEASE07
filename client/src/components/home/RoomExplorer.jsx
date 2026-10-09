import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddToCart, Icon } from '@/components/ui';
import { rooms, services } from '@shared/catalog.js';
import { inr } from '@/utils/format';

/**
 * Signature hero piece: a cut-away house. Choosing a room lists the services
 * people book most for it. Rooms are real buttons, so it works by keyboard too.
 */
const SHAPES = {
  bedroom: { x: 40, y: 150, w: 250, h: 125, label: [62, 176] },
  bathroom: { x: 290, y: 150, w: 190, h: 125, label: [310, 176] },
  living: { x: 40, y: 275, w: 240, h: 125, label: [62, 301] },
  kitchen: { x: 280, y: 275, w: 200, h: 125, label: [300, 301] },
};

function Furniture({ id }) {
  switch (id) {
    case 'bedroom':
      return (
        <g>
          <rect x="128" y="186" width="44" height="34" rx="3" className="h-window" />
          <path d="M150 186v34M128 203h44" className="h-line" />
          <rect x="192" y="182" width="78" height="20" rx="5" className="h-appliance" />
          <path d="M200 196h62" className="h-line" />
          <rect x="58" y="214" width="8" height="48" rx="2" className="h-wood" />
          <rect x="62" y="236" width="128" height="26" rx="6" className="h-fabric" />
          <rect x="70" y="226" width="34" height="14" rx="5" className="h-pillow" />
          <rect x="226" y="222" width="36" height="40" rx="3" className="h-wood" />
          <path d="M244 222v40" className="h-line" />
        </g>
      );
    case 'bathroom':
      return (
        <g>
          <ellipse cx="440" cy="204" rx="18" ry="22" className="h-window" />
          <path d="M330 186v26M322 186h16" className="h-metal" />
          <path d="M318 222c0 10 4 14 12 14h80c8 0 12-4 12-14z" className="h-ceramic" />
          <rect x="304" y="236" width="128" height="26" rx="10" className="h-ceramic" />
          <rect x="446" y="232" width="20" height="30" rx="6" className="h-ceramic" />
          <path d="M330 190c-4 6-4 10 0 14" className="h-water" />
        </g>
      );
    case 'living':
      return (
        <g>
          <path d="M150 275v16" className="h-metal" />
          <ellipse cx="150" cy="294" rx="44" ry="4" className="h-wood" />
          <rect x="204" y="312" width="52" height="34" rx="2" className="h-art" />
          <path d="M210 340l12-14 10 9 8-7 10 12" className="h-line" />
          <rect x="58" y="344" width="142" height="20" rx="7" className="h-fabric" />
          <rect x="62" y="362" width="134" height="20" rx="6" className="h-fabric" />
          <rect x="54" y="352" width="12" height="32" rx="5" className="h-fabric-dark" />
          <rect x="192" y="352" width="12" height="32" rx="5" className="h-fabric-dark" />
          <path d="M236 384v-24M236 362c-8-6-10-14-6-20M236 366c8-6 10-12 6-18" className="h-plant" />
          <rect x="228" y="378" width="16" height="10" rx="2" className="h-wood" />
        </g>
      );
    case 'kitchen':
      return (
        <g>
          <path d="M360 292h44l8 22h-60z" className="h-metal-fill" />
          <rect x="294" y="352" width="140" height="40" rx="3" className="h-wood" />
          <rect x="292" y="346" width="144" height="8" rx="2" className="h-counter" />
          <circle cx="372" cy="342" r="5" className="h-metal-fill" />
          <circle cx="392" cy="342" r="5" className="h-metal-fill" />
          <rect x="308" y="338" width="32" height="8" rx="2" className="h-ceramic" />
          <path d="M324 338v-12h8" className="h-metal" />
          <rect x="442" y="306" width="30" height="86" rx="4" className="h-appliance" />
          <path d="M442 338h30M447 316v12M447 346v14" className="h-line" />
        </g>
      );
    default:
      return null;
  }
}

export default function RoomExplorer() {
  const [room, setRoom] = useState('kitchen');
  const current = rooms.find((r) => r.id === room);
  const list = useMemo(() => current.serviceIds.map((id) => services.find((s) => s.id === id)).filter(Boolean), [current]);

  return (
    <section className="room-explorer" aria-label="Shop by room">
      <div className="room-explorer__art">
        <svg viewBox="0 0 520 420" role="group" aria-label="Choose a room">
          <path d="M20 152 260 34l240 118" className="h-roof" />
          <rect x="226" y="58" width="24" height="34" className="h-chimney" />
          {Object.entries(SHAPES).map(([id, s]) => {
            const r = rooms.find((x) => x.id === id);
            const active = id === room;
            return (
              <g
                key={id}
                className={`h-room ${active ? 'is-active' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={`${r.name}: ${r.serviceIds.length} services`}
                onClick={() => setRoom(id)}
                onMouseEnter={() => setRoom(id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setRoom(id))}
              >
                <rect x={s.x} y={s.y} width={s.w} height={s.h} className="h-room__fill" />
                <Furniture id={id} />
                <g className="h-room__tag">
                  <rect x={s.label[0] - 10} y={s.label[1] - 15} width={r.name.length * 7.4 + 20} height="22" rx="11" />
                  <text x={s.label[0]} y={s.label[1]}>{r.name}</text>
                </g>
              </g>
            );
          })}
          <rect x="40" y="150" width="440" height="250" className="h-frame" />
          <path d="M20 400h480" className="h-ground" />
        </svg>
      </div>
      <div className="room-explorer__list">
        <p className="room-explorer__title"><strong>{current.name}</strong><span>Most booked for this room</span></p>
        <ul>
          {list.map((s) => (
            <li key={s.id}>
              <Link to={`/c/${s.categoryId}#${s.id}`} className="room-item">
                <span className="room-item__name">{s.name}</span>
                <span className="room-item__price">{s.quote ? 'Free visit' : inr(s.price)}</span>
              </Link>
              <AddToCart service={s} compact />
            </li>
          ))}
        </ul>
        <Link to="/search" className="text-link">Browse all services<Icon name="right" size={16} /></Link>
      </div>
    </section>
  );
}
