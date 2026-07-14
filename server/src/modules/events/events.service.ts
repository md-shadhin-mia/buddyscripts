import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"

interface CreateEventInput {
  title: string
  description?: string
  imageUrl?: string
  location?: string
  startDate: string
  endDate: string
}

interface UpdateEventInput {
  title?: string
  description?: string
  imageUrl?: string
  location?: string
  startDate?: string
  endDate?: string
}

const eventInclude = {
  creator: { select: { id: true, name: true, avatar: true } },
} as const

export async function createEvent(userId: string, input: CreateEventInput) {
  const event = await prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      location: input.location,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      creatorId: userId,
    },
    include: eventInclude,
  })
  return event
}

export async function getEvents() {
  const events = await prisma.event.findMany({
    where: { startDate: { gte: new Date() } },
    include: { _count: { select: { attendees: true } } },
    orderBy: { startDate: "asc" },
  })
  return events
}

export async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      attendees: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
    },
  })
  if (!event) throw ApiError.notFound("Event not found")
  return event
}

export async function updateEvent(userId: string, id: string, input: UpdateEventInput) {
  const event = await prisma.event.findUnique({ where: { id }, select: { creatorId: true } })
  if (!event) throw ApiError.notFound("Event not found")
  if (event.creatorId !== userId) throw ApiError.forbidden()

  const data: any = { ...input }
  if (input.startDate) data.startDate = new Date(input.startDate)
  if (input.endDate) data.endDate = new Date(input.endDate)

  const updated = await prisma.event.update({
    where: { id },
    data,
    include: eventInclude,
  })
  return updated
}

export async function deleteEvent(userId: string, id: string) {
  const event = await prisma.event.findUnique({ where: { id }, select: { creatorId: true } })
  if (!event) throw ApiError.notFound("Event not found")
  if (event.creatorId !== userId) throw ApiError.forbidden()

  await prisma.event.delete({ where: { id } })
}

export async function rsvp(userId: string, eventId: string, input: { status: "GOING" | "MAYBE" | "NOT_GOING" }) {
  const attendee = await prisma.eventAttendee.upsert({
    where: { eventId_userId: { eventId, userId } },
    create: { eventId, userId, status: input.status },
    update: { status: input.status },
  })
  return attendee
}
