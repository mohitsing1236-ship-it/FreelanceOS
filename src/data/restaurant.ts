import type {
  CatchItem,
  DietaryTag,
  MenuCategory,
  RestaurantInfo,
  SourceNote,
} from '../types';

// Everything you'll want to change lives in this file.

export const restaurant: RestaurantInfo = {
  name: 'Tidewater',
  tagline: 'Oysters shucked to order. Fish landed that morning.',
  intro:
    'A small oyster bar and seafood kitchen. The menu is short and follows the boats, so what you eat tonight was in the water this morning.',
  address: ['14 Harbour Lane', 'Old Quay'],
  phone: '+1 555 010 4477',
  email: 'table@tidewater.example',
  currency: 'USD',
  locale: 'en-US',
  hours: [
    { days: 'Monday', hours: 'Closed' },
    { days: 'Tuesday to Thursday', hours: '5 pm to 10 pm' },
    { days: 'Friday and Saturday', hours: '5 pm to 11 pm' },
    { days: 'Sunday', hours: '4 pm to 9 pm' },
  ],
  slots: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  closedWeekdays: [1],
  maxOnlineParty: 8,
};

export const tagLabels: Record<DietaryTag, string> = {
  gf: 'Gluten-free',
  v: 'Vegetarian',
  spicy: 'Spicy',
};

export const todaysCatch: CatchItem[] = [
  { name: 'Rock oysters', source: 'Two bays, 40 minutes up the coast', price: 4, unit: 'each' },
  { name: 'Wild prawns', source: 'Day-boat, in at 6 am', price: 9, unit: 'each' },
  { name: 'Hand-dived scallops', source: 'Northern shelf', price: 8, unit: 'each' },
  { name: 'Whole snapper', source: 'Line-caught, about 1 kg', price: 42, unit: 'per fish' },
  { name: 'Yellowfin tuna', source: 'Line-caught', price: 21, unit: 'per plate' },
];

export const menu: MenuCategory[] = [
  {
    id: 'raw',
    label: 'Raw bar',
    note: 'Shucked and sliced to order. Nothing here is cooked.',
    items: [
      {
        name: 'Oysters, half dozen',
        description: 'Shucked to order with red wine mignonette and lemon.',
        price: 24,
        tags: ['gf'],
      },
      {
        name: 'Oysters, dozen',
        description: 'Same oysters, twice the fun. Ask what came in today.',
        price: 44,
        tags: ['gf'],
      },
      {
        name: 'Scallop crudo',
        description: 'Hand-dived scallop, green apple, chili oil and lime.',
        price: 19,
        tags: ['gf', 'spicy'],
      },
      {
        name: 'Tuna tartare',
        description: 'Yellowfin, pickled ginger, sesame and crisp rice.',
        price: 21,
      },
      {
        name: 'Shellfish tower for two',
        description: 'Oysters, prawns, crab claws, clams and the day\u2019s crudo.',
        price: 78,
        tags: ['gf'],
      },
    ],
  },
  {
    id: 'small',
    label: 'Small plates',
    note: 'Made for sharing, best ordered in twos and threes.',
    items: [
      {
        name: 'Clam chowder',
        description: 'Smoked bacon, potato and a splash of cream sherry.',
        price: 14,
        tags: ['gf'],
      },
      {
        name: 'Crab toast',
        description: 'Brown crab, chives and lemon on grilled sourdough.',
        price: 17,
      },
      {
        name: 'Fried calamari',
        description: 'Semolina crust, lemon aioli and pickled peppers.',
        price: 16,
      },
      {
        name: 'Grilled octopus',
        description: 'Charred, with white beans and salsa verde.',
        price: 20,
        tags: ['gf'],
      },
      {
        name: 'Charred greens',
        description: 'Broccolini, garlic, chili and toasted almonds.',
        price: 12,
        tags: ['v', 'gf', 'spicy'],
      },
    ],
  },
  {
    id: 'mains',
    label: 'Mains',
    note: 'The whole fish changes with the catch. Ask your server.',
    items: [
      {
        name: 'Whole grilled snapper',
        description: 'Fennel, lemon and olive oil. Filleted at the table.',
        price: 42,
        tags: ['gf'],
      },
      {
        name: 'Lobster roll',
        description: 'Butter-poached lobster in a toasted brioche bun, with fries.',
        price: 36,
      },
      {
        name: 'Seafood linguine',
        description: 'Clams, prawns and mussels in white wine, garlic and parsley.',
        price: 32,
      },
      {
        name: 'Fish and chips',
        description: 'Beer-battered cod, tartare sauce, mushy peas.',
        price: 26,
      },
      {
        name: 'Mushroom and leek pie',
        description: 'Flaky pastry, thyme cream and a small green salad.',
        price: 24,
        tags: ['v'],
      },
    ],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    note: 'Baked in-house each afternoon.',
    items: [
      {
        name: 'Lemon tart',
        description: 'Sharp lemon curd, buttery crust, whipped cream.',
        price: 11,
        tags: ['v'],
      },
      {
        name: 'Salted caramel pot de cr\u00e8me',
        description: 'Silky custard, sea salt and a shortbread crumb.',
        price: 11,
        tags: ['v', 'gf'],
      },
      {
        name: 'Sorbet of the day',
        description: 'Ask what fruit came in with the greens.',
        price: 8,
        tags: ['v', 'gf'],
      },
    ],
  },
];

export const story = {
  heading: 'A short menu, because the boats decide.',
  body: 'We buy from the same handful of fishers and farmers every week, and we cook what they bring. When the scallops are small, we say so. When the snapper is the best it has been all month, it goes on the grill whole.',
};

export const sources: SourceNote[] = [
  {
    what: 'Oysters',
    where: 'Grown in two sheltered bays and delivered every morning in seaweed-lined crates.',
  },
  {
    what: 'Prawns and scallops',
    where: 'Bought from a family boat that fishes day trips only, so nothing sits on ice for long.',
  },
  {
    what: 'Snapper and tuna',
    where: 'Line-caught, then handled one fish at a time.',
  },
  {
    what: 'Everything else',
    where: 'Greens, bread and lemons from farms and bakers within an hour\u2019s drive.',
  },
];
