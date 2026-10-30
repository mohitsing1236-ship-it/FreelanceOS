import { sources, story } from '../data/restaurant';

export function Story() {
  return (
    <section className="section section--mid" id="story" aria-labelledby="story-title">
      <div className="wrap story__grid">
        <div className="story__copy">
          <h2 id="story-title">{story.heading}</h2>
          <p>{story.body}</p>
        </div>
        <dl className="sources">
          {sources.map((source) => (
            <div key={source.what} className="sources__row">
              <dt>{source.what}</dt>
              <dd>{source.where}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
