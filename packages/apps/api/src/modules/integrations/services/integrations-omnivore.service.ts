import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { __omnivore_api_base_url__ } from '@src/constants';
import { Group } from '@src/modules/group/entities';
import { GroupService } from '@src/modules/group/group.service';
import { IntegrationType } from '@src/modules/hotel/entities';
import {
  OmnivoreCreateOrderArgs,
  OmnivoreCreateOrderItemArgs,
  OmnivoreCreateOrderItemModifier,
  OmnivoreCreateOrderResponse,
  OmnivoreGetDiscountsResponse,
  OmnivoreGetEmployeesResponse,
  OmnivoreGetLocationsResponse,
  OmnivoreGetOrderTypesResponse,
  OmnivoreGetRevenueCentersResponse,
  OmnivoreGetTablesResponse,
  OmnivoreMenuCategory,
  OmnivoreMenuItemsResponse,
  OmnivoreMenuModifierGroupResponse,
  OmnivoreMenuModifierGroupsResponse,
  OmnivorePriceLevelsResponse,
  WebhookJWTPayload,
} from '@src/modules/integrations/types';
import { Order } from '@src/modules/order/order.entity';
import {
  Pricelist,
  PricelistCategory,
  PricelistDeliveryType,
  PricelistMultiplierType,
  PricelistItem,
  PricelistItemModifier,
} from '@src/modules/pricelist/pricelist.entity';
import { Context, UserSession } from '@src/utils/context';
import { InvalidSessionError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class IntegrationsOmnivoreService extends BaseService<Group> {
  private webhookSession: WebhookJWTPayload;
  private apiKey: string | undefined;

  //TODO: Might be good if we can put the locationId as a property

  constructor(
    @Inject(CONTEXT)
    private readonly context: Context,
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
    private readonly groupService: GroupService
  ) {
    super(groupRepository);
  }

  get session() {
    if (this.context.req) {
      return <UserSession>this.context.req.user;
    }

    return this.webhookSession;
  }

  async getClient(locationId?: string) {
    await this.checkAuthorize();

    return axios.create({
      baseURL: `${__omnivore_api_base_url__}/1.0${
        locationId ? `/locations/${locationId}` : ''
      }`,
      headers: { 'Content-Type': 'application/json', 'Api-Key': this.apiKey },
    });
  }

  async checkAuthorize() {
    if (this.apiKey) {
      return;
    }

    const groupId = this.session.group;

    if (!groupId) {
      throw new InvalidSessionError('hotel');
    }

    const group = await this.groupService.findOne(groupId);

    if (!group) {
      throw new InvalidSessionError('hotel');
    }

    this.apiKey = group?.integrations?.omnivore?.apiKey;

    if (!this.apiKey) {
      throw new UnauthorizedException();
    }
  }

  async authorize(apiKey: string) {
    const groupId = this.session.group;
    if (!groupId) {
      throw new InvalidSessionError('hotel');
    }

    const group = await this.groupService.findOne(groupId);

    if (!group) {
      throw new InvalidSessionError('hotel');
    }

    group.integrations = {
      ...group.integrations,
      omnivore: { apiKey, type: IntegrationType.POS },
    };

    this.apiKey = apiKey;

    this.groupService.persist(group);
  }

  async getLocations() {
    const client = await this.getClient();
    const response = await client.get<OmnivoreGetLocationsResponse>(
      '/locations'
    );
    return response.data._embedded.locations;
  }

  async getItems(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreMenuItemsResponse>('/menu/items');
    return response.data._embedded.menu_items;
  }

  async getItemPriceLevels(locationId: string, itemId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivorePriceLevelsResponse>(
      `/menu/items/${itemId}/price_levels`
    );
    return response.data._embedded.price_levels;
  }

  async getModifierGroup(id: string, locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreMenuModifierGroupResponse>(
      `/menu/modifier_groups/${id}/`
    );

    return response.data;
  }

  async getModifierGroups(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreMenuModifierGroupsResponse>(
      '/menu/modifier_groups'
    );

    return response.data._embedded.modifier_groups;
  }

  async getTables(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreGetTablesResponse>('/tables');

    return response.data;
  }

  async getOrderTypes(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreGetOrderTypesResponse>(
      '/order_types'
    );
    return response.data;
  }

  async getRevenueCenters(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreGetRevenueCentersResponse>(
      '/revenue_centers'
    );
    return response.data;
  }

  async getDiscounts(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreGetDiscountsResponse>(
      '/discounts'
    );
    return response.data._embedded.discounts;
  }

  async getEmployees(locationId: string) {
    const client = await this.getClient(locationId);
    const response = await client.get<OmnivoreGetEmployeesResponse>(
      '/employees'
    );
    return response.data;
  }

  async createTicket(order: Order) {
    const posSettings = order.pricelist.posSettings;
    if (!posSettings) {
      throw new InvalidSessionError('guest');
    }

    const {
      employeeId,
      revenueCenterId,
      posId: locationId,
      tableService,
      roomService,
    } = posSettings;

    const client = await this.getClient(locationId);

    const menuItems = await this.getItems(locationId!);
    const modifierGroups = await this.getModifierGroups(locationId!);
    const modifiers = modifierGroups.flatMap(
      ({ _embedded }) => _embedded.modifiers
    );

    const createOrderArgs: OmnivoreCreateOrderArgs = {
      auto_send: true,
      employee: employeeId!,
      order_type:
        order.delivery === PricelistDeliveryType.Room
          ? roomService.posId
          : tableService.posId,
      name: order.space.name,
      revenue_center: revenueCenterId!,
      table: order.roomNumber,
    };

    const response = await client.post<OmnivoreCreateOrderResponse>(
      '/tickets',
      createOrderArgs
    );

    const { id: ticketId } = response.data;
    order.posId = ticketId;

    const orderItems: Array<OmnivoreCreateOrderItemArgs | undefined> =
      order.items.map((orderItem) => {
        const menuItem = menuItems.find(({ id }) => id === orderItem.posId);

        const orderItemModifiers = orderItem.modifiers.flatMap(
          ({ options }) => options
        );

        if (!menuItem) {
          return undefined;
        }

        const createOrderItemArgs: OmnivoreCreateOrderItemArgs = {
          menu_item: menuItem.id,
          ...(orderItem.omnivoreSettings?.roomService
            ? { price_level: orderItem.omnivoreSettings.roomService.posId }
            : orderItem.omnivoreSettings?.tableService
            ? { price_level: orderItem.omnivoreSettings.tableService.posId }
            : {}),
          quantity: orderItem.quantity,
          modifiers: orderItemModifiers
            .map((orderItemModifier) => {
              const modifier = modifiers.find(
                ({ id }) => id === orderItemModifier.posId
              );

              if (!modifier) {
                return undefined;
              }

              return {
                modifier: modifier.id,
                quantity: orderItem.quantity,
                comment: order.notes,
              };
            })
            .filter(Boolean) as Array<OmnivoreCreateOrderItemModifier>,
        };
        return createOrderItemArgs;
      });
    await client.post(`/tickets/${ticketId}/items`, orderItems.filter(Boolean));

    const discountItems = order.items
      .filter(({ discount }) => !!discount?.posId)
      .map((orderItem) => ({
        menu_item: orderItem.posId,
        discounts: [
          {
            discount: orderItem.discount?.posId,
          },
        ],
      }));

    if (discountItems.length) {
      await client.post(`/tickets/${ticketId}/items`, discountItems);
    }

    if (order.discount) {
      await client.post(`/tickets/${ticketId}/discounts`, [
        {
          discount: order.discount.posId,
        },
      ]);
    }
  }

  async resyncPOS(pricelist: Pricelist) {
    const { posSettings, catalog } = pricelist;
    const locationId = posSettings?.posId || '';
    const newCatalog = await this.getCatalogFromOmnivore(locationId);
    const newDiscounts = await this.getDiscounts(locationId);

    const updatedCategories: PricelistCategory[] = [];

    newCatalog.categories.map((category, catIndex) => {
      const existingCategory = catalog?.categories.find(
        ({ posId }) => posId === category.posId
      );
      if (existingCategory) {
        const updatedItems: PricelistItem[] = [];
        category.items.map((item, itemIndex) => {
          const existingItem = catalog?.categories[catIndex]?.items?.find(
            ({ posId }) => item.posId === posId
          );
          if (existingItem) {
            const priceLevels = item.posSettings?.priceLevels;
            const tablePriceLevel = priceLevels?.find(
              ({ posId }) =>
                posId === existingItem.posSettings?.tableService.posId
            );
            const roomPriceLevel = priceLevels?.find(
              ({ posId }) =>
                posId === existingItem.posSettings?.roomService.posId
            );
            const updatedItem: PricelistItem = {
              ...existingItem,
              modifiers: item.modifiers,
              roomServicePrice: roomPriceLevel?.price || item.roomServicePrice,
              regularPrice: tablePriceLevel?.price || item.regularPrice,
              posSettings: item.posSettings,
              promotions: {
                ...existingItem.promotions,
                discounts: existingItem.promotions?.discounts?.map(
                  (discount) => {
                    const omnivoreDiscount = newDiscounts.find(
                      ({ pos_id }) => pos_id === discount.posId
                    );
                    return {
                      ...discount,
                      available: omnivoreDiscount?.available,
                      ...(omnivoreDiscount?.min_ticket_total !== null && {
                        minOrderAmount: omnivoreDiscount?.min_ticket_total,
                      }),
                      value:
                        discount.type === PricelistMultiplierType.Absolute
                          ? (omnivoreDiscount?.value || 0) / 100
                          : omnivoreDiscount?.value || 0,
                    };
                  }
                ),
              },
            };
            updatedItems[itemIndex] = updatedItem;
          } else {
            updatedItems.push({ ...item, name: `(NEW) ${item.name}` });
          }
        });
        const updatedCategory: PricelistCategory = {
          ...existingCategory,
          name: category.name,
          description: category.description,
          items: updatedItems,
        };
        updatedCategories[catIndex] = updatedCategory;
      } else {
        updatedCategories.push(category);
      }
    });

    pricelist.promotions = {
      ...pricelist.promotions,
      discounts: pricelist.promotions?.discounts?.map((discount) => {
        const omnivoreDiscount = newDiscounts.find(
          ({ pos_id }) => pos_id === discount.posId
        );
        return {
          ...discount,
          available: omnivoreDiscount?.available,
          ...(omnivoreDiscount?.min_ticket_total !== null && {
            minOrderAmount: omnivoreDiscount?.min_ticket_total,
          }),
          value:
            discount.type === PricelistMultiplierType.Absolute
              ? (omnivoreDiscount?.value || 0) / 100
              : omnivoreDiscount?.value || 0,
        };
      }),
    };
    pricelist.catalog = { ...pricelist.catalog, categories: updatedCategories };

    return pricelist;
  }

  async getCatalogFromOmnivore(locationId: string) {
    const menuItems = await this.getItems(locationId);
    const modifierGroups = await this.getModifierGroups(locationId);
    const menuCategories: OmnivoreMenuCategory[] = [];
    menuItems.forEach((menuItem) => {
      menuItem._embedded.menu_categories.forEach((menuCategory) => {
        const findCategory = menuCategories.find(
          ({ id }) => menuCategory.id === id
        );
        if (!findCategory) {
          menuCategories.push(menuCategory);
        }
      });
    });

    const categories: PricelistCategory[] = [];
    const categoryPromises = menuCategories.map(
      async ({ name: catName, id }) => {
        const menuCategoryItems = menuItems.filter((menuItem) =>
          menuItem._embedded.menu_categories.find(
            (menu_category) => menu_category.name === catName
          )
        );
        const items: PricelistItem[] = [];
        const itemPromises = menuCategoryItems.map(
          async ({ id, _embedded, price_per_unit, name }) => {
            const priceLevels = _embedded.price_levels.map(
              ({ name, price_per_unit, id }) => ({
                name,
                posId: id,
                price: (price_per_unit !== null ? price_per_unit : 0) / 100,
              })
            );
            const modifiers: PricelistItemModifier[] = [];
            const modifierPromises = _embedded.option_sets.map(
              async (option_set) => {
                const parts = option_set._links.modifier_group.href.split('/');
                const modifierGroupId = parts?.[parts.length - 2];
                const modifierGroup = modifierGroups.find(
                  ({ id }) => id === modifierGroupId
                );
                if (!modifierGroup) {
                  return;
                }
                modifiers.push({
                  id: uuid(),
                  name: modifierGroup.name,
                  posId: modifierGroup.id,
                  maxSelection: option_set.maximum,
                  required: option_set.required,
                  options: modifierGroup._embedded.modifiers.map(
                    (menuModifier) => ({
                      id: uuid(),
                      posId: menuModifier.id,
                      name: menuModifier.name,
                      price:
                        menuModifier.price_per_unit !== null
                          ? menuModifier.price_per_unit / 100
                          : 0,
                    })
                  ),
                });
              }
            );

            await Promise.all(modifierPromises);

            const unitPrice =
              (price_per_unit !== null ? price_per_unit : 0) / 100;

            const priceLevel = priceLevels.find(
              ({ name }) => name === 'Default'
            );

            items.push({
              id: uuid(),
              name,
              regularPrice: unitPrice,
              roomServicePrice: unitPrice,
              posId: id,
              modifiers,
              ...(priceLevel && {
                posSettings: {
                  tableService: priceLevel,
                  roomService: priceLevel,
                  priceLevels,
                },
              }),
            });
          }
        );

        await Promise.all(itemPromises);

        categories.push({
          id: uuid(),
          name: catName,
          items,
          posId: id,
        });
      }
    );
    await Promise.all(categoryPromises);
    return { categories };
  }
}
