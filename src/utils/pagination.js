/**
 * Pagination utility for consistent paginated responses across all list endpoints.
 *
 * Usage in controllers:
 *   const { page, limit } = parsePagination(req.query);
 *
 * Usage in services:
 *   const { data, pagination } = await paginate(prisma.model, { where, orderBy, include }, { page, limit });
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse and validate pagination parameters from query string.
 * @param {object} query - Express req.query
 * @returns {{ page: number, limit: number }}
 */
function parsePagination(query = {}) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = DEFAULT_PAGE;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return { page, limit };
}

/**
 * Execute a paginated Prisma findMany + count query.
 *
 * @param {object} model  - Prisma delegate (e.g. prisma.transaction)
 * @param {object} args   - Prisma findMany args: { where, orderBy, include, select }
 * @param {{ page: number, limit: number }} pagination
 * @returns {Promise<{ data: any[], pagination: { page, limit, total, totalPages } }>}
 */
async function paginate(model, args = {}, { page, limit }) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({
      ...args,
      skip,
      take: limit,
    }),
    model.count({ where: args.where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = {
  parsePagination,
  paginate,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
