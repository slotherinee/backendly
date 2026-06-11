export const MAX_COLLECTIONS_PER_PROJECT = 50;
export const DEFAULT_COLLECTION_LIMIT = 20;
export const MAX_COLLECTION_LIMIT = 100;
export const ALLOWED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const;

export type HttpMethod = (typeof ALLOWED_METHODS)[number];
