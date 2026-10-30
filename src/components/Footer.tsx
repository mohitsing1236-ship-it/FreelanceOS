import { restaurant } from '../data/restaurant';

export function Footer() {
  return (
    <footer className="site-footer" id="visit">
      <div className="wrap footer__grid">
        <div>
          <p className="footer__brand">{restaurant.name}</p>
          <p className="footer__blurb">Oyster bar and seafood kitchen.</p>
        </div>

        <div>
          <h2 className="footer__heading">Hours</h2>
          <dl className="hours">
            {restaurant.hours.map((entry) => (
              <div key={entry.days} className="hours__row">
                <dt>{entry.days}</dt>
                <dd>{entry.hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="footer__heading">Find us</h2>
          <address className="footer__address">
            {restaurant.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <a href={`tel:${restaurant.phone.replace(/\s/g, '')}`}>{restaurant.phone}</a>
            <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
          </address>
        </div>
      </div>
      <div className="wrap footer__legal">
        <p>
          &copy; {new Date().getFullYear()} {restaurant.name}
        </p>
      </div>
    </footer>
  );
}
