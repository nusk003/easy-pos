import {
  Attraction,
  AttractionCatalog,
  AttractionCategory,
  AttractionPlace,
} from '@hm/sdk';

export type EditablePlace = Partial<AttractionPlace>;

export interface EditableCategory
  extends Partial<Omit<AttractionCategory, 'places'>> {
  places: EditablePlace[];
}

export interface EditableCatalog extends Omit<AttractionCatalog, 'categories'> {
  categories: EditableCategory[];
}

export interface EditableAttraction extends Omit<Attraction, 'catalog'> {
  catalog: EditableCatalog;
}
