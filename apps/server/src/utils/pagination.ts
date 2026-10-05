export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function getPaginationParams(
  query: PaginationQuery,
  defaultLimit = 10,
  maxLimit = 50,
): PaginationParams {
  const page = Math.max(1, Number(query.page) || 1);
  const rawLimit = Number(query.limit) || defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

export function formatPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
