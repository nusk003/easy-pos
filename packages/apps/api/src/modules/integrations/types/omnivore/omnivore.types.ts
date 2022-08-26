export interface OmnivoreLink {
  href: string;
}

export interface OmnivorePriceLevel {
  id: string;
  name: string;
  price_per_unit: number | null;
}
export interface OmnivoreMenuModifier {
  id: string;
  pos_id: string | null;
  open: boolean;
  name: string;
  price_per_unit: number | null;
  _embedded: { price_levels: OmnivorePriceLevel[] };
}

export interface OmnivoreMenuModifierGroupResponse {
  id: string;
  pos_id: string | null;
  name: string;
  _embedded: { modifiers: OmnivoreMenuModifier[] };
}

export interface OmnivoreMenuModifierGroupsResponse {
  id: string;
  pos_id: string | null;
  name: string;
  _embedded: { modifier_groups: OmnivoreMenuModifierGroupResponse[] };
}

export interface OmnivoreMenuOptionSet {
  id: string;
  maximum: number;
  minimum: number;
  required: boolean;
  _links: { modifier_group: OmnivoreLink };
}

export interface OmnivoreMenuCategoryType {
  id: string;
  name: string;
}

export interface OmnivoreMenuCategory {
  id: string;
  pos_id: string;
  name: string;
}

export interface OmnivoreMenuItem {
  id: string;
  name: string;
  pos_id: string;
  price_per_unit: number;
  open: boolean;
  open_name: string | null;
  in_stock: boolean;
  _embedded: {
    menu_categories: OmnivoreMenuCategory[];
    option_sets: OmnivoreMenuOptionSet[];
    price_levels: OmnivorePriceLevel[];
  };
}

export interface OmnivorePriceLevelsResponse {
  _embedded: {
    price_levels: OmnivorePriceLevel[];
  };
}

export interface OmnivoreMenuItemsResponse {
  _embedded: { menu_items: OmnivoreMenuItem[] };
  count: number;
  limit: number;
}

export interface OmnivoreLocation {
  id: string;
  name: string;
  pos_type: string;
}
export interface OmnivoreGetLocationsResponse {
  _embedded: { locations: OmnivoreLocation[] };
}

export interface OmnivoreEmployee {
  id: string;
  first_name: string;
  last_name: string;
}

export interface OmnivoreRevenueCenter {
  id: string;
  name: string;
}

export interface OmnivoreOrderType {
  id: string;
  name: string;
}

export interface OmnivoreTable {
  id: string;
  name: string;
}

export interface OmnivoreGetEmployeesResponse {
  _embedded: { employees: OmnivoreEmployee[] };
}

export interface OmnivoreGetRevenueCentersResponse {
  _embedded: { revenue_centers: OmnivoreRevenueCenter[] };
}

export interface OmnivoreGetOrderTypesResponse {
  _embedded: { order_types: OmnivoreOrderType[] };
}

export interface OmnivoreGetTablesResponse {
  _embedded: { tables: OmnivoreTable[] };
}

export interface OmnivoreCreateOrderArgs {
  employee: string;
  order_type: string;
  revenue_center: string;
  table: string;
  guest_count?: number;
  name: string;
  auto_send: boolean;
}

export interface OmnivoreCreateOrderItemModifier {
  modifier: string;
  quantity: number;
  price_level?: string;
  comment?: string;
}

export interface OmnivoreDiscount {
  applies_to: {
    item: boolean;
    ticket: boolean;
  };
  available: boolean;
  id: string;
  max_amount: number | null;
  max_percent: number | null;
  min_amount: number | null;
  min_percent: number | null;
  min_ticket_total: number | null;
  name: string;
  open: boolean;
  pos_id: string;
  type: string;
  value: number;
}
export interface OmnivoreCreateOrderItemArgs {
  menu_item: string;
  quantity: number;
  price_level?: string;
  comment?: string;
  modifiers: Array<OmnivoreCreateOrderItemModifier>;
  discounts?: { discount: string }[];
}

export interface OmnivoreCreateOrderResponse {
  id: string;
}

export interface OmnivoreGetDiscountsResponse {
  _embedded: { discounts: OmnivoreDiscount[] };
}
