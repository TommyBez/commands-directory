import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server'

// Define search params schema - reuse this in useQueryStates and createLoader
export const commandsSearchParams = {
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  tag: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
}

// Create loader for server components (pages)
export const loadCommandsSearchParams = createLoader(commandsSearchParams)
