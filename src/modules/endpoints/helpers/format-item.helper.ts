export function formatItem(item: {
  id: string;
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    ...(item.data as object),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
