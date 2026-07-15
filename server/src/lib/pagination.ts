import { env } from "../config/env"

export interface PaginateParams {
  cursor?: string
  take?: number
}

export interface PaginateResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export async function paginate<T extends { id: string }>(
  model: any,
  params: PaginateParams & { where?: Record<string, unknown> },
  defaultTake = 20,
  extraArgs: Record<string, unknown> = {},
): Promise<PaginateResult<T>> {
  const take = params.take ?? defaultTake
  const takePlusOne = take + 1

  const args: any = {
    take: takePlusOne,
    orderBy: { id: "desc" },
    ...(params.where && { where: params.where }),
    ...extraArgs,
  }

  if (params.cursor) {
    args.cursor = { id: params.cursor }
    args.skip = 1
  }

  const items = await model.findMany(args) as T[]
  const hasMore = items.length > take
  const data = hasMore ? items.slice(0, take) : items
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}
