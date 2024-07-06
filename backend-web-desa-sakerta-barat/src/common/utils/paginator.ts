import { UserResponse } from '../../model/user.model';
import { PrismaService } from '../prisma.service';

export interface PaginateOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  searchFields?: string[];
  filter?: Record<string, any>;
  select?: Record<string, boolean>;
}

export interface PaginatedResult<T> {
  data: T;
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search: string;
  };
}

export async function prismaPaginate<T>(
  prisma: PrismaService,
  model: string,
  options: PaginateOptions,
): Promise<PaginatedResult<T>> {
  const page = parseInt(options.page?.toString() || '1', 10);
  const limit = parseInt(options.limit?.toString() || '10', 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'id';
  const sortOrder = options.sortOrder || 'desc';
  const search = options.search || '';
  const searchFields = options.searchFields || [];
  const filter = options.filter || {};
  const select =
    Object.keys(options.select || {}).length > 0 ? options.select : undefined;
  const whereClause: any = { ...filter };

  if (search && searchFields.length > 0) {
    whereClause.OR = searchFields.map((field) => ({
      [field]: { contains: search },
    }));
  }

  const [data, totalItems] = await Promise.all([
    prisma[model].findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      ...(select ? { select } : {}),
    }),
    prisma[model].count({ where: whereClause }),
  ]);

  return {
    data: data,
    meta: {
      itemsPerPage: limit,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      sortBy,
      sortOrder,
      search,
    },
  };
}
