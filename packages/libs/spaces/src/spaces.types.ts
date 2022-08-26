import {
  Pricelist,
  PricelistCatalog,
  PricelistCategory,
  PricelistItem,
  PricelistItemModifier,
  PricelistItemOption,
  PricelistLabel,
} from '@hm/sdk';

export interface PricelistBasketItemOption extends PricelistItemOption {
  selected?: boolean;
}

export interface PricelistBasketItemModifier
  extends Omit<PricelistItemModifier, 'options' | 'maxSelection' | 'required'> {
  options: PricelistBasketItemOption[];
  maxSelection?: number;
  required?: boolean;
}

export interface PricelistBasketItem extends Omit<PricelistItem, 'modifiers'> {
  quantity?: number;
  modifiers?: PricelistBasketItemModifier[];
}

export interface PricelistWithBasketItemCategory
  extends Omit<PricelistCategory, 'items'> {
  items: PricelistBasketItem[];
}

export interface PricelistWithBasketItemCatalog
  extends Omit<PricelistCatalog, 'categories'> {
  categories: PricelistWithBasketItemCategory[];
}

export interface PricelistWithBasketItem extends Omit<Pricelist, 'catalog'> {
  catalog: PricelistWithBasketItemCatalog;
}

export type PricelistBasket = {
  items: PricelistBasketItem[];
  notes?: string;
  roomNumber?: string;
  dateScheduled?: Date;
};

export type PricelistBaskets = Record<string, PricelistBasket>;

export interface EditablePricelistLabel extends Partial<PricelistLabel> {
  selected?: boolean;
}

export interface EditableItem extends Omit<Partial<PricelistItem>, 'labels'> {
  labels?: EditablePricelistLabel[];
}

export interface EditableCategory
  extends Omit<Partial<PricelistCategory>, 'items'> {
  collapsed?: boolean;
  items?: EditableItem[];
}

export interface EditableCatalog extends Omit<PricelistCatalog, 'categories'> {
  categories: EditableCategory[];
}

export interface EditablePricelist extends Omit<Pricelist, 'catalog'> {
  catalog: EditableCatalog;
}
