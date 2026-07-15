import { describe, it, expect, afterEach } from "vitest"
import request from "supertest"
import app from "../app"
import prisma from "../config/database"

afterEach(async () => {
  await prisma.hiddenPost.deleteMany()
  await prisma.savedPost.deleteMany()
  await prisma.eventAttendee.deleteMany()
  await prisma.event.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.storyViewer.deleteMany()
  await prisma.story.deleteMany()
  await prisma.reaction.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.friendship.deleteMany()
  await prisma.friendRequest.deleteMany()
  await prisma.post.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()
})

const registerUser = (email: string, password = "secret123", name = "Test") =>
  request(app).post("/api/auth/register").send({ email, password, name })

const loginUser = (email: string, password = "secret123") =>
  request(app).post("/api/auth/login").send({ email, password })

describe("POST /api/auth/register", () => {
  it("registers a new user", async () => {
    const res = await registerUser("alice@test.com", "secret123", "Alice")
    expect(res.status).toBe(201)
    expect(res.body.status).toBe("success")
    expect(res.body.data).toMatchObject({ email: "alice@test.com", name: "Alice", avatar: null })
    expect(res.body.data.id).toBeDefined()
    expect(res.body.data.password).toBeUndefined()
  })

  it("rejects duplicate email", async () => {
    await registerUser("bob@test.com")
    const res = await registerUser("bob@test.com")
    expect(res.status).toBe(409)
    expect(res.body.message).toBe("Email already in use")
  })

  it("validates input fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "bad", password: "short", name: "A" })
    expect(res.status).toBe(400)
    expect(res.body.message).toContain("Invalid email format")
  })
})

describe("POST /api/auth/login", () => {
  it("logs in with valid credentials", async () => {
    await registerUser("carol@test.com", "secret123", "Carol")
    const res = await loginUser("carol@test.com", "secret123")
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.headers["set-cookie"][0]).toContain("refreshToken")
  })

  it("rejects wrong password", async () => {
    await registerUser("dave@test.com", "secret123", "Dave")
    const res = await loginUser("dave@test.com", "wrongpass")
    expect(res.status).toBe(401)
  })
})

describe("POST /api/auth/refresh", () => {
  it("returns a new access token with valid cookie", async () => {
    await registerUser("eve@test.com", "secret123", "Eve")
    const loginRes = await loginUser("eve@test.com")
    const res = await request(app).post("/api/auth/refresh").set("Cookie", loginRes.headers["set-cookie"])
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBeTruthy()
  })

  it("rejects missing cookie", async () => {
    const res = await request(app).post("/api/auth/refresh")
    expect(res.status).toBe(401)
  })
})

describe("POST /api/auth/logout", () => {
  it("clears the refresh cookie and invalidates token", async () => {
    await registerUser("fay@test.com", "secret123", "Fay")
    const loginRes = await loginUser("fay@test.com")
    const res = await request(app).post("/api/auth/logout").set("Cookie", loginRes.headers["set-cookie"])
    expect(res.status).toBe(200)
  })
})
