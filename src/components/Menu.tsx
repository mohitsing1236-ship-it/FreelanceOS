import { useRef, useState, type KeyboardEvent } from 'react';
import { menu, restaurant, tagLabels } from '../data/restaurant';
import { formatPrice } from '../lib/format';
import type { DietaryTag, MenuCategoryId } from '../types';

export function Menu() {
  const [activeId, setActiveId] = useState<MenuCategoryId>(menu[0].id);
  const tabRefs = useRef<Partial<Record<MenuCategoryId, HTMLButtonElement | null>>>({});
  const active = menu.find((category) => category.id === activeId) ?? menu[0];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % menu.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + menu.length) % menu.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = menu.length - 1;
    else return;

    event.preventDefault();
    const target = menu[next];
    setActiveId(target.id);
    tabRefs.current[target.id]?.focus();
  }

  return (
    <section className="section section--light" id="menu" aria-labelledby="menu-title">
      <div className="wrap">
        <h2 id="menu-title">The menu</h2>

        <div className="tabs" role="tablist" aria-label="Menu sections">
          {menu.map((category, index) => {
            const selected = category.id === activeId;
            return (
              <button
                key={category.id}
                ref={(node) => {
                  tabRefs.current[category.id] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`panel-${category.id}`}
                tabIndex={selected ? 0 : -1}
                className="tab"
                onClick={() => setActiveId(category.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="menu-panel"
        >
          <p className="menu-panel__note">{active.note}</p>
          <ul className="dishes">
            {active.items.map((item) => (
              <li key={item.name} className="dish">
                <div className="row">
                  <h3 className="row__name">{item.name}</h3>
                  <span className="leader" aria-hidden="true" />
                  <span className="row__price">
                    {formatPrice(item.price, restaurant.currency, restaurant.locale)}
                  </span>
                </div>
                <p className="dish__desc">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <ul className="tags">
                    {item.tags.map((tag: DietaryTag) => (
                      <li key={tag} className="tag">
                        <span aria-hidden="true">{tag}</span>
                        <span className="sr-only">{tagLabels[tag]}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="menu-legend">
          gf: gluten-free &nbsp; v: vegetarian &nbsp; spicy: has some heat. Tell us about any
          allergies when you book or order.
        </p>
      </div>
    </section>
  );
}
