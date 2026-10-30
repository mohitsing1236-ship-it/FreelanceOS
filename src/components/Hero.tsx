import { restaurant } from '../data/restaurant';
import { CatchBoard } from './CatchBoard';

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <h1 className="wordmark">{restaurant.name}</h1>
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="hero__tagline">{restaurant.tagline}</p>
            <p className="hero__intro">{restaurant.intro}</p>
            <div className="hero__actions">
              <a className="btn" href="#reserve">
                Book a table
              </a>
              <a className="btn btn--ghost" href="#menu">
                See the menu
              </a>
            </div>
          </div>
          <CatchBoard />
        </div>
      </div>
    </section>
  );
}
