import { restaurant, todaysCatch } from '../data/restaurant';
import { formatPrice } from '../lib/format';

export function CatchBoard() {
  return (
    <aside className="board" id="catch" aria-labelledby="catch-title">
      <h2 className="board__title" id="catch-title">
        Landed today
      </h2>
      <p className="board__note">Prices are per piece unless noted. When it&rsquo;s gone, it&rsquo;s gone.</p>
      <ul className="board__list">
        {todaysCatch.map((item) => (
          <li key={item.name} className="board__item">
            <div className="row">
              <span className="row__name">{item.name}</span>
              <span className="leader" aria-hidden="true" />
              <span className="row__price">
                {formatPrice(item.price, restaurant.currency, restaurant.locale)}{' '}
                <span className="row__unit">{item.unit}</span>
              </span>
            </div>
            <p className="board__source">{item.source}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
