import { restaurant } from '../data/restaurant';

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <a className="brand" href="#top">
          {restaurant.name}
        </a>
        <nav className="site-nav" aria-label="Main">
          <a href="#catch">Tonight&rsquo;s catch</a>
          <a href="#menu">Menu</a>
          <a href="#story">Our fishers</a>
          <a href="#visit">Hours and location</a>
        </nav>
        <a className="btn btn--small" href="#reserve">
          Book a table
        </a>
      </div>
    </header>
  );
}
