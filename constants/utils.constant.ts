export const SORT_BY = {
  NAME: 'name',
  BASE_PRICE: 'basePrice',
  CREATED_AT: 'createdAt',
} as const

export const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortByType = (typeof SORT_BY)[keyof typeof SORT_BY]
export type OrderByType = (typeof ORDER_BY)[keyof typeof ORDER_BY]
