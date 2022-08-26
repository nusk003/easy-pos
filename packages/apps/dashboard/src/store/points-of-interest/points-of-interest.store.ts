import {
  AttractionCatalog,
  AttractionCategory,
  AttractionPlace,
  AttractionPlaceLabel,
  GenerateAttractionPlacesCategoryArgs,
} from '@hm/sdk';
import create from 'zustand';
import { v4 as uuid } from 'uuid';

interface PointsOfInterestPlaceSidebar {
  category?: AttractionCategory;
  place?: AttractionPlace;
  visible?: boolean;
}

interface PointsOfInterestCategorySidebar {
  category?: AttractionCategory;
  visible?: boolean;
}

interface PointsOfInterestCreatePlaceModal {
  category?: AttractionCategory;
  visible?: boolean;
  isAddManualPlaceVisible?: boolean;
  placeName?: string;
}

export type PointsOfInterestRootState = {
  pointsOfInterestCatalog: AttractionCatalog;
  setPointsOfInterestCatalog: (
    pointsOfInterestCatalog: AttractionCatalog
  ) => void;

  isCatalogChanges: boolean;
  setIsCatalogChanges: (isCatalogChanges: boolean) => void;

  pointsOfInterestPlaceSidebar: PointsOfInterestPlaceSidebar | undefined;
  setPointsOfInterestPlaceSidebar: (
    sidebar: PointsOfInterestPlaceSidebar | undefined
  ) => void;

  pointsOfInterestCategorySidebar:
    | PointsOfInterestCategorySidebar
    | undefined
    | null;
  setPointsOfInterestCategorySidebar: (
    sidebar: PointsOfInterestCategorySidebar | undefined
  ) => void;

  pointsOfInterestCreatePlaceModal?: PointsOfInterestCreatePlaceModal;
  setPointsOfInterestCreatePlaceModal: (
    pointsOfInterestCreatePlaceModal:
      | PointsOfInterestCreatePlaceModal
      | undefined
  ) => void;

  setPointsOfInterestCategories: (
    categories: Array<AttractionCategory>
  ) => void;

  createPointsOfInterestLabel: (label: AttractionPlaceLabel) => void;

  updatePointsOfInterestLabel: (updatedLabel: AttractionPlaceLabel) => void;

  deletePointsOfInterestLabel: (index: number) => void;

  createPointsOfInterestCategory: (
    category?: Partial<AttractionCategory>
  ) => string;

  updatePointsOfInterestCategory: (category: AttractionCategory) => void;

  deletePointsOfInterestCategory: (categoryId: string) => void;

  createPointsOfInterestPlace: (place: Partial<AttractionPlace>) => void;

  updatePointsOfInterestPlace: (updatedPlace: AttractionPlace) => void;

  deletePointsOfInterestPlaces: (ids: string[]) => void;

  showGeneratePlaceResultsModal: boolean;
  setShowGeneratePlaceResultsModal: (state: boolean) => void;

  searchResultsAttractionCategories: AttractionCategory[];
  setSearchResultsAttractionCategories: (
    state: PointsOfInterestRootState['searchResultsAttractionCategories']
  ) => void;

  selectedGeneratePlacesCategories: GenerateAttractionPlacesCategoryArgs[];
  setSelectedGeneratePlacesCategories: (
    state: PointsOfInterestRootState['selectedGeneratePlacesCategories']
  ) => void;
};

export const usePointsOfInterestStore = create<PointsOfInterestRootState>(
  (set, get) => ({
    pointsOfInterestCatalog: {
      categories: [],
      labels: [],
    },
    setPointsOfInterestCatalog: (pointsOfInterestCatalog) => {
      set({ pointsOfInterestCatalog });
    },

    isCatalogChanges: false,
    setIsCatalogChanges: (isCatalogChanges) => {
      set({ isCatalogChanges });
    },

    pointsOfInterestPlaceSidebar: undefined,
    setPointsOfInterestPlaceSidebar: (pointsOfInterestPlaceSidebar) => {
      set((s) => ({
        pointsOfInterestPlaceSidebar: {
          ...s.pointsOfInterestPlaceSidebar,
          ...pointsOfInterestPlaceSidebar,
        },
      }));
    },

    pointsOfInterestCategorySidebar: undefined,
    setPointsOfInterestCategorySidebar: (pointsOfInterestCategorySidebar) => {
      set((s) => ({
        pointsOfInterestCategorySidebar: {
          ...s.pointsOfInterestCategorySidebar,
          ...pointsOfInterestCategorySidebar,
        },
      }));
    },

    pointsOfInterestCreatePlaceModal: undefined,
    setPointsOfInterestCreatePlaceModal: (pointsOfInterestCreatePlaceModal) => {
      if (!pointsOfInterestCreatePlaceModal) {
        set({
          pointsOfInterestCreatePlaceModal: {},
        });
      }

      const { pointsOfInterestCreatePlaceModal: s } = get();

      set({
        pointsOfInterestCreatePlaceModal: {
          ...s,
          ...pointsOfInterestCreatePlaceModal,
        },
      });
    },

    setPointsOfInterestCategories: (categories) => {
      const { pointsOfInterestCatalog } = get();
      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories },
        },
      });
    },

    createPointsOfInterestPlace: (place) => {
      const { pointsOfInterestCatalog, pointsOfInterestCreatePlaceModal } =
        get();
      const { category } = pointsOfInterestCreatePlaceModal!;
      const newCategories = [...pointsOfInterestCatalog.categories];
      const index = newCategories.findIndex(({ id }) => id === category!.id);
      const newCategory = { ...newCategories[index] };
      const places = [...newCategory.places!];
      places.push(place as AttractionPlace);
      newCategory.places = places;

      newCategories[index] = newCategory;

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories: newCategories },
        },
        isCatalogChanges: true,
      });
    },

    updatePointsOfInterestPlace: (updatedPlace) => {
      const {
        pointsOfInterestCatalog,
        pointsOfInterestPlaceSidebar: pointsOfInterestSidebar,
      } = get();
      const index = pointsOfInterestCatalog.categories.findIndex(
        ({ id }) => id === pointsOfInterestSidebar?.category!.id
      );
      const newCategories = [...pointsOfInterestCatalog.categories];
      const newCategory = { ...newCategories[index] };
      const places = [...newCategory.places!];
      const placeIndex = places.findIndex(
        (place) => place.id === updatedPlace.id
      );
      places[placeIndex] = { ...updatedPlace };
      newCategory.places = places;
      newCategories[index] = newCategory;
      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories: newCategories },
        },
        isCatalogChanges: true,
      });
    },

    deletePointsOfInterestPlaces: (placeIds: string[]) => {
      const { pointsOfInterestCatalog } = get();

      const categories = pointsOfInterestCatalog.categories.map((category) => {
        const places = category.places
          .map((place) => {
            if (placeIds.includes(place.id!)) {
              return undefined;
            }

            return place;
          })
          .filter(Boolean) as AttractionPlace[];

        return { ...category, places };
      });

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories },
        },
        isCatalogChanges: true,
      });
    },

    createPointsOfInterestCategory: (
      category?: Partial<AttractionCategory>
    ) => {
      const id = uuid();

      const { pointsOfInterestCatalog } = get();
      const categories = [...pointsOfInterestCatalog.categories];

      categories.push({
        name: '',
        description: '',
        places: [],
        ...category,
        id,
      });

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories },
        },
        isCatalogChanges: true,
      });

      return id;
    },

    updatePointsOfInterestCategory: (category) => {
      const { pointsOfInterestCatalog } = get();

      const categories = [...pointsOfInterestCatalog.categories];

      const index = categories.findIndex((c) => c.id === category.id);

      if (index < 0) {
        return;
      }

      categories[index] = category;

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories },
        },
        isCatalogChanges: true,
      });
    },

    deletePointsOfInterestCategory: (categoryId) => {
      const { pointsOfInterestCatalog } = get();

      const categories = [...pointsOfInterestCatalog.categories];

      const index = categories.findIndex((c) => c.id === categoryId);

      if (index < 0) {
        return;
      }

      categories.splice(index, 1);

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ categories },
        },
        isCatalogChanges: true,
      });
    },

    createPointsOfInterestLabel: (label) => {
      const { pointsOfInterestCatalog } = get();
      const labels = pointsOfInterestCatalog.labels;
      labels!.push(label);
      set({
        pointsOfInterestCatalog: { ...pointsOfInterestCatalog, ...{ labels } },
        isCatalogChanges: true,
      });
    },

    updatePointsOfInterestLabel: (updatedLabel) => {
      const { pointsOfInterestCatalog } = get();
      const labels = [...pointsOfInterestCatalog.labels!];
      const index = labels.findIndex(({ id }) => id === updatedLabel.id);
      labels[index] = updatedLabel;

      const categories = pointsOfInterestCatalog.categories;
      categories.forEach((category, catIndex) => {
        category.places!.forEach((place, placeIndex) => {
          const index = place.labels!.findIndex(
            (label) => label.id === updatedLabel.id
          );
          if (index > -1) {
            place.labels![index] = updatedLabel;
            categories[catIndex].places![placeIndex] = place;
          }
        });
      });

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ labels, categories },
        },
        isCatalogChanges: true,
      });
    },

    deletePointsOfInterestLabel: (index) => {
      const { pointsOfInterestCatalog } = get();

      const labels = [...pointsOfInterestCatalog.labels!];
      const [deletedLabel] = labels.splice(index, 1);

      const categories = pointsOfInterestCatalog.categories;
      categories.forEach((category, catIndex) => {
        category.places!.forEach((place, placeIndex) => {
          const index = place.labels!.findIndex(
            (label) => label.id === deletedLabel.id
          );
          if (index > -1) {
            place!.labels!.splice(index, 1);
            categories[catIndex].places![placeIndex] = place;
          }
        });
      });

      set({
        pointsOfInterestCatalog: {
          ...pointsOfInterestCatalog,
          ...{ labels, categories },
        },
        isCatalogChanges: true,
      });
    },

    showGeneratePlaceResultsModal: false,
    setShowGeneratePlaceResultsModal: (state: boolean) => {
      set({ showGeneratePlaceResultsModal: state });
    },

    searchResultsAttractionCategories: [],
    setSearchResultsAttractionCategories: (
      state: PointsOfInterestRootState['searchResultsAttractionCategories']
    ) => {
      set({ searchResultsAttractionCategories: state });
    },

    selectedGeneratePlacesCategories: [],
    setSelectedGeneratePlacesCategories: (
      state: PointsOfInterestRootState['selectedGeneratePlacesCategories']
    ) => {
      set({ selectedGeneratePlacesCategories: state });
    },
  })
);
