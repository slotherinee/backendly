import {
  DEFAULT_COLLECTION_LIMIT,
  MAX_COLLECTION_LIMIT,
} from '@modules/collections/constants/collections.constants';

const RESERVED = new Set(['page', 'limit', 'sort', 'order']);
const SORTABLE_COLUMNS = new Set(['createdAt', 'updatedAt', 'id']);

export function parsePagination(
  query: Record<string, unknown>,
  defaultLimit = DEFAULT_COLLECTION_LIMIT,
) {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(
    MAX_COLLECTION_LIMIT,
    Math.max(1, parseInt(query.limit as string) || defaultLimit),
  );
  return { page, limit, skip: (page - 1) * limit };
}

export function parseSort(
  query: Record<string, unknown>,
): Record<string, 'asc' | 'desc'> {
  const sort = query.sort as string | undefined;
  const order =
    (query.order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  if (sort && SORTABLE_COLUMNS.has(sort)) return { [sort]: order };
  return { createdAt: 'desc' };
}

export function parseFilters(query: Record<string, unknown>) {
  return Object.entries(query)
    .filter(([key]) => !RESERVED.has(key))
    .map(([key, value]) => ({ path: [key], equals: value }));
}
