export type DietaryTag = 'gf' | 'v' | 'spicy';

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  tags?: DietaryTag[];
}

export type MenuCategoryId = 'raw' | 'small' | 'mains' | 'sweet';

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
  note: string;
  items: MenuItem[];
}

export interface CatchItem {
  name: string;
  source: string;
  price: number;
  unit: string;
}

export interface SourceNote {
  what: string;
  where: string;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  intro: string;
  address: string[];
  phone: string;
  email: string;
  currency: string;
  locale: string;
  hours: OpeningHours[];
  /** 24h "HH:mm" times offered in the booking form */
  slots: string[];
  /** 0 = Sunday ... 6 = Saturday */
  closedWeekdays: number[];
  maxOnlineParty: number;
}
