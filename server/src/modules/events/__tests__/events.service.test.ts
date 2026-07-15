import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const eventId = "event-1"

describe("EventsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createEvent", () => {
    it("creates an event", async () => {
      const event = { id: eventId, title: "Party", description: null, startDate: new Date(), endDate: new Date(), creatorId: userId, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.event.create.mockResolvedValue(event as any)

      const { createEvent } = await import("../events.service")
      const result = await createEvent(userId, {
        title: "Party",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: "My place",
      })

      expect(result).toEqual(event)
      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: {
          title: "Party",
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          location: "My place",
          creatorId: userId,
        },
        include: { creator: { select: { id: true, name: true, avatar: true } } },
      })
    })
  })

  describe("getEvents", () => {
    it("returns upcoming events", async () => {
      mockPrisma.event.findMany.mockResolvedValue([])

      const { getEvents } = await import("../events.service")
      const result = await getEvents()

      expect(result).toEqual([])
    })
  })

  describe("getEvent", () => {
    it("returns a single event with attendee info", async () => {
      const event = { id: eventId, title: "Party", creatorId: userId, attendees: [] } as any
      mockPrisma.event.findUnique.mockResolvedValue(event)

      const { getEvent } = await import("../events.service")
      const result = await getEvent(eventId)

      expect(result).toMatchObject(event)
    })

    it("throws 404 if not found", async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null)

      const { getEvent } = await import("../events.service")
      await expect(getEvent(eventId)).rejects.toMatchObject({ statusCode: 404 })
    })
  })

  describe("updateEvent", () => {
    it("updates own event", async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: eventId, creatorId: userId } as any)
      mockPrisma.event.update.mockResolvedValue({} as any)

      const { updateEvent } = await import("../events.service")
      await updateEvent(userId, eventId, { title: "Updated Party" })

      expect(mockPrisma.event.update).toHaveBeenCalled()
    })

    it("throws 403 when not the creator", async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: eventId, creatorId: "other-user" } as any)

      const { updateEvent } = await import("../events.service")
      await expect(updateEvent(userId, eventId, { title: "Hacked" })).rejects.toMatchObject({ statusCode: 403 })
    })
  })

  describe("deleteEvent", () => {
    it("deletes own event", async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: eventId, creatorId: userId } as any)
      mockPrisma.event.delete.mockResolvedValue({} as any)

      const { deleteEvent } = await import("../events.service")
      await deleteEvent(userId, eventId)

      expect(mockPrisma.event.delete).toHaveBeenCalledWith({ where: { id: eventId } })
    })
  })

  describe("rsvp", () => {
    it("creates or updates attendee status", async () => {
      mockPrisma.eventAttendee.upsert.mockResolvedValue({} as any)

      const { rsvp } = await import("../events.service")
      await rsvp(userId, eventId, { status: "GOING" })

      expect(mockPrisma.eventAttendee.upsert).toHaveBeenCalledWith({
        where: { eventId_userId: { eventId, userId } },
        create: { eventId, userId, status: "GOING" },
        update: { status: "GOING" },
      })
    })
  })
})
