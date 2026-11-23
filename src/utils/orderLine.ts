export interface OrderLineItem {
  id: string;
  dishId: string;
  variantId?: string;
  extraIds: string[];
  unitWithExtrasCents: number;
  qty: number;
}

export function buildOrderLineId(
  dishId: string,
  variantId?: string,
  extraIds: string[] = []
): string {
  const sortedExtras = [...extraIds].sort().join(',');
  return `${dishId}::${variantId || ''}::${sortedExtras}`;
}
