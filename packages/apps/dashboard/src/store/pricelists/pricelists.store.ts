import {
  Order,
  Pricelist,
  PricelistCatalog,
  PricelistCategory,
  PricelistItem,
  PricelistLabel,
} from '@hm/sdk';
import dayjs from 'dayjs';
import { PrinterInfo } from 'electron';
import { v4 as uuid } from 'uuid';
import create from 'zustand';
import { configurePersist } from 'zustand-persist';

const { persist } = configurePersist({
  storage: localStorage,
  rootKey: 'z',
});
interface PricelistsItemSidebar {
  category?: PricelistCategory;
  item?: PricelistItem;
  visible?: boolean;
}

interface PricelistsItemDiscount {
  pricelist?: Pricelist;
  category?: PricelistCategory;
  item?: PricelistItem;
  visible?: boolean;
}

interface PricelistsCategorySidebar {
  category?: PricelistCategory;
  visible?: boolean;
}

export interface Printer extends PrinterInfo {
  copies: number;
}

interface PrinterQueueJob {
  id: string;
  dateCreated: Date;
}

export type PricelistRootState = {
  pricelistsCatalog: PricelistCatalog;
  setPricelistsCatalog: (pricelistsCatalog: PricelistCatalog) => void;

  isCatalogChanges: boolean;
  setIsCatalogChanges: (isCatalogChanges: boolean) => void;

  pricelistsItemSidebar: PricelistsItemSidebar | undefined;
  setPricelistsItemSidebar: (
    sideBar: PricelistsItemSidebar | undefined
  ) => void;

  pricelistsItemDiscount: PricelistsItemDiscount | undefined;
  setPricelistsItemDiscount: (
    discount: PricelistsItemDiscount | undefined
  ) => void;

  pricelistsCategorySidebar: PricelistsCategorySidebar | undefined;
  setPricelistsCategorySidebar: (
    sideBar: PricelistsCategorySidebar | undefined
  ) => void;

  setPricelistsCategories: (categories: Array<PricelistCategory>) => void;

  createPricelistsLabel: (label: PricelistLabel) => void;

  updatePricelistsLabel: (updatedLabel: PricelistLabel) => void;

  deletePricelistsLabel: (index: number) => void;

  createPricelistsCategory: (category?: Partial<PricelistCategory>) => string;

  updatePricelistsCategory: (updatedCategory: PricelistCategory) => void;

  deletePricelistsCategory: (categoryId: string) => void;

  createPricelistItem: (
    categoryId: string,
    item?: Partial<PricelistItem>
  ) => void;

  updatePricelistsItem: (
    updatedItem: PricelistItem,
    categoryId: string
  ) => void;

  deletePricelistsItems: (ids: string[]) => void;

  printers: Record<string, Array<Printer>>;

  setPricelistPrinters: (
    pricelistId: string,
    pricelistPrinters: Array<Printer>
  ) => void;

  printerQueue: PrinterQueueJob[];

  addPrinterQueueJob: (order: Order) => void;
};

export const usePricelistStore = create<PricelistRootState>(
  persist(
    {
      key: 'zp',
      allowlist: ['printers', 'printerQueue'],
    },
    (set, get) => ({
      pricelistsCatalog: {
        categories: [],
        labels: [],
      },
      setPricelistsCatalog: (pricelistsCatalog) => {
        set({ pricelistsCatalog });
      },

      pricelistsItemDiscount: undefined,
      setPricelistsItemDiscount: (pricelistsItemDiscount) => {
        set((s) => ({
          pricelistsItemDiscount: {
            ...s.pricelistsItemDiscount,
            ...pricelistsItemDiscount,
          },
        }));
      },

      isCatalogChanges: false,
      setIsCatalogChanges: (isCatalogChanges) => {
        set({ isCatalogChanges });
      },

      pricelistsItemSidebar: undefined,
      setPricelistsItemSidebar: (pricelistsItemSidebar) => {
        set((s) => ({
          pricelistsItemSidebar: {
            ...s.pricelistsItemSidebar,
            ...pricelistsItemSidebar,
          },
        }));
      },

      pricelistsCategorySidebar: undefined,
      setPricelistsCategorySidebar: (pricelistsCategorySidebar) => {
        set((s) => ({
          pricelistsCategorySidebar: {
            ...s.pricelistsCategorySidebar,
            ...pricelistsCategorySidebar,
          },
        }));
      },

      setPricelistsCategories: (categories) => {
        const { pricelistsCatalog } = get();
        set({ pricelistsCatalog: { ...pricelistsCatalog, ...{ categories } } });
      },

      createPricelistItem: (categoryId, item) => {
        const { pricelistsCatalog } = get();

        const newCategories = [...pricelistsCatalog.categories];

        const index = newCategories.findIndex(({ id }) => id === categoryId);
        const newCategory = { ...newCategories[index] };

        const items = [...newCategory.items!];
        items.push({
          name: '',
          modifiers: [],
          regularPrice: 0,
          roomServicePrice: 0,
          ...item,
          id: uuid(),
        });
        newCategory.items = items;

        newCategories[index] = newCategory;

        const newPricelistsCatalog = {
          ...pricelistsCatalog,
          ...{ categories: newCategories },
        };

        set({
          pricelistsCatalog: newPricelistsCatalog,
          isCatalogChanges: true,
        });
      },

      updatePricelistsItem: (updatedItem, categoryId) => {
        const { pricelistsCatalog } = get();

        const index = pricelistsCatalog.categories.findIndex(
          ({ id }) => id === categoryId
        );
        const newCategories = [...pricelistsCatalog.categories];
        const newCategory = { ...newCategories[index] };

        const items = [...newCategory.items!];
        const itemIndex = items.findIndex((item) => item.id === updatedItem.id);
        if (itemIndex > -1) items[itemIndex] = { ...updatedItem };
        newCategory.items = items;
        newCategories[index] = newCategory;
        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ categories: newCategories },
          },
          isCatalogChanges: true,
        });
      },

      deletePricelistsItems: (itemIds: string[]) => {
        const { pricelistsCatalog } = get();

        const categories = pricelistsCatalog.categories.map((category) => {
          const items = category.items
            .map((item) => {
              if (itemIds.includes(item.id!)) {
                return undefined;
              }

              return item;
            })
            .filter(Boolean) as PricelistItem[];

          return { ...category, items };
        });

        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ categories },
          },
          isCatalogChanges: true,
        });
      },

      createPricelistsCategory: (category) => {
        const { pricelistsCatalog } = get();
        const categories = [...pricelistsCatalog.categories];

        const id = uuid();

        categories.push({
          name: '',
          description: '',
          items: [],
          ...category,
          id,
        });

        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ categories },
          },
          isCatalogChanges: true,
        });

        return id;
      },

      updatePricelistsCategory: (category) => {
        const { pricelistsCatalog } = get();

        const categories = [...pricelistsCatalog.categories];

        const index = categories.findIndex((c) => c.id === category.id);

        if (index < 0) {
          return;
        }

        categories[index] = category;

        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ categories },
          },
          isCatalogChanges: true,
        });
      },

      deletePricelistsCategory: (categoryId) => {
        const { pricelistsCatalog } = get();

        const categories = [...pricelistsCatalog.categories];

        const index = categories.findIndex((c) => c.id === categoryId);

        if (index < 0) {
          return;
        }

        categories.splice(index, 1);

        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ categories },
          },
          isCatalogChanges: true,
        });
      },

      createPricelistsLabel: (label) => {
        const { pricelistsCatalog } = get();
        const labels = pricelistsCatalog.labels;
        labels!.push(label);
        set({
          pricelistsCatalog: { ...pricelistsCatalog, ...{ labels } },
          isCatalogChanges: true,
        });
      },

      updatePricelistsLabel: (updatedLabel) => {
        const { pricelistsCatalog } = get();
        const labels = [...pricelistsCatalog.labels!];
        const index = labels.findIndex(({ id }) => id === updatedLabel.id);
        labels[index] = updatedLabel;

        const categories = pricelistsCatalog.categories;
        categories.forEach((category, catIndex) => {
          category.items!.forEach((item, itemIndex) => {
            if (item.labels) {
              const index = item.labels!.findIndex(
                (label) => label.id === updatedLabel.id
              );
              if (index > -1) {
                item.labels![index] = updatedLabel;
                categories[catIndex].items![itemIndex] = item;
              }
            }
          });
        });

        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ labels, categories },
          },
          isCatalogChanges: true,
        });
      },

      deletePricelistsLabel: (index) => {
        const { pricelistsCatalog } = get();

        const labels = [...pricelistsCatalog.labels!];
        const [deletedLabel] = labels.splice(index, 1);

        const categories = pricelistsCatalog.categories;
        categories.forEach((category, catIndex) => {
          category.items!.forEach((item, itemIndex) => {
            if (item.labels) {
              const index = item.labels!.findIndex(
                (label) => label.id === deletedLabel.id
              );
              if (index > -1) {
                item!.labels!.splice(index, 1);
                categories[catIndex].items![itemIndex] = item;
              }
            }
          });
        });

        set({
          pricelistsCatalog: {
            ...pricelistsCatalog,
            ...{ labels, categories },
          },
          isCatalogChanges: true,
        });
      },

      printers: {},

      setPricelistPrinters: (
        pricelistId: string,
        pricelistPrinters: Array<Printer>
      ) => {
        const { printers } = get();

        printers[pricelistId] = pricelistPrinters;

        set({ printers });
      },

      printerQueue: [],

      addPrinterQueueJob: (order: Order) => {
        const printerQueue = get().printerQueue.filter((job) =>
          dayjs(job.dateCreated).isAfter(dayjs().subtract(15, 'minutes'))
        );

        printerQueue.push({
          id: order.id,
          dateCreated: order.dateCreated,
        });

        set({ printerQueue });
      },
    })
  )
);
