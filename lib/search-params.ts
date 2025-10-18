import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server'

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  tag: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
})
