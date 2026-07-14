import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const IMG = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const USERS = [
  { name: "Alice Chen", bio: "Full-stack developer & coffee enthusiast. Building cool stuff since 2019." },
  { name: "Bob Martinez", bio: "Product designer @ TechCo. I love minimalism and good typography." },
  { name: "Carol Nguyen", bio: "Digital nomad exploring the world one city at a time. ✈️" },
  { name: "David Kim", bio: "Machine learning engineer. Making computers see since 2020." },
  { name: "Eva Santos", bio: "Startup founder & mental health advocate. Building a better tomorrow." },
  { name: "Frank Okafor", bio: "Backend engineer. Distributed systems, databases, and all things infra." },
  { name: "Grace Liu", bio: "UX researcher who believes great design starts with empathy." },
  { name: "Henry Patel", bio: "DevOps wizard. Kubernetes, Terraform, and automating everything." },
  { name: "Iris Johansson", bio: "Data scientist by day, amateur baker by night. Scones > algorithms." },
  { name: "Jack Thompson", bio: "Mobile developer (iOS + Android). Flutter enthusiast." },
  { name: "Kate Williams", bio: "Open source maintainer. TypeScript lover. She/her." },
  { name: "Leo Garcia", bio: "Game developer. Building worlds one polygon at a time." },
  { name: "Mia Robinson", bio: "Tech journalist covering AI, privacy, and the future of work." },
  { name: "Noah Anderson", bio: "Security researcher. Breaking things to make them safer." },
  { name: "Olivia Brown", bio: "Creative director at StudioNine. Art meets code." },
  { name: "Paul Jackson", bio: "Cloud architect. AWS certified, Terraform obsessed." },
  { name: "Quinn Taylor", bio: "Indie hacker building SaaS tools for remote teams." },
  { name: "Rosa Hernandez", bio: "Community manager & event organizer. Connecting people IRL." },
  { name: "Sam Wilson", bio: "Frontend engineer. CSS artist. Building beautiful UIs." },
  { name: "Tina Chang", bio: "Product manager who codes. Bridging business and tech." },
]

const POSTS = [
  { content: "Just shipped a major refactor of our payment pipeline. 3 months of work finally paying off! Performance improved by 40% and the code is so much cleaner now. This is why I love working with a team that prioritizes technical excellence.", imageSeed: "post-payment" },
  { content: "Hot take: TypeScript is fine, but the real superpower is good type design. Learning to model your domain properly makes more difference than any language feature. Been thinking about this a lot lately.", imageSeed: null },
  { content: "Working on a new side project — a CLI tool for managing environment variables across teams. Think dotenv + 1Password. Anyone interested in beta testing?", imageSeed: "post-cli" },
  { content: "Spent the weekend hiking in the Rockies. No laptop, no notifications, just mountains and silence. Came back with a fresh perspective on that architecture problem I was stuck on. Sometimes the best debugging tool is walking away.", imageSeed: "post-hiking" },
  { content: "Just finished reading 'Designing Data-Intensive Applications' for the third time. Every read reveals something new. If you work with distributed systems and haven't read this, you're missing out.", imageSeed: null },
  { content: "Our team just migrated from a monorepo to microservices. Here are the top 5 lessons we learned the hard way: thread carefully with database boundaries, invest in observability early, don't over-engineer service boundaries, automate everything, and communicate constantly.", imageSeed: "post-migration" },
  { content: "Launched our product on Product Hunt today! 2 years of bootstrapping, countless late nights, and here we are. So grateful for everyone who has supported this journey.", imageSeed: "post-launch" },
  { content: "Unpopular opinion: meetings aren't the problem. Bad meetings are. A well-run 15-minute standup is more productive than a day of Slack ping-pong. The issue isn't collaboration — it's lack of structure.", imageSeed: null },
  { content: "Built a real-time dashboard this week using websockets and a custom event pipeline. The look on my PM's face when data updated in real-time was priceless. Demo day win! 🏆", imageSeed: "post-dashboard" },
  { content: "My desk setup evolution over 5 years: Starter desk → Standing desk → Minimal setup → Plants + monitor arms → Current: cozy maximalism. It's not about the gear, it's about what inspires you to create.", imageSeed: "post-desk" },
  { content: "Just open-sourced a library I've been working on for months. It's a lightweight state management solution for React that uses signals under the hood. Check it out and let me know what you think!", imageSeed: null },
  { content: "The best career advice I ever got: 'Learn to communicate as well as you code.' Technical skills get you in the door, but communication skills determine how far you go. Still the truest thing I know.", imageSeed: null },
  { content: "Attended an amazing tech conference this week. Highlights: quantum computing keynote, an incredible talk on accessible design, and meeting so many brilliant people. The future of tech is bright.", imageSeed: "post-conference" },
  { content: "Debugged a production issue at 2 AM. Root cause: a missing null check. The bug was introduced 6 months ago and only surfaced now under specific conditions. Always validate your assumptions, folks.", imageSeed: null },
  { content: "Teaching a workshop on GraphQL tomorrow at the local meetup. Covering federation, error handling, and performance optimization. Should be fun! Come say hi if you're in the area.", imageSeed: null },
  { content: "New blog post: 'Why We Switched from REST to GraphQL (and What We Learned)'. TL;DR: better developer experience, more flexible queries, but caching is harder. Link in bio.", imageSeed: "post-blog" },
  { content: "Weekend project complete: a retro-style arcade game built with vanilla JavaScript and Canvas API. No frameworks, just pure DOM manipulation and a lot of nostalgia. It's amazing what you can build with fundamentals.", imageSeed: "post-arcade" },
  { content: "Had a candid conversation with my manager about burnout. So grateful to work somewhere that treats mental health seriously. If your workplace doesn't — find one that does. Life is too short.", imageSeed: null },
  { content: "Our team just hit 90% test coverage. It wasn't easy — convincing stakeholders, refactoring legacy code, dealing with flaky tests. But the confidence it gives us when deploying is absolutely worth it.", imageSeed: null },
  { content: "Exploring Tokyo for the first time! The contrast between ancient temples and neon-lit streets is incredible. Found a tiny ramen shop that serves the best broth I've ever had.", imageSeed: "post-tokyo" },
  { content: "Just ran my first marathon! 42.2 km in 4 hours and 23 minutes. Training for 6 months paid off. The last 10 km were brutal but crossing that finish line was one of the best moments of my life.", imageSeed: null },
  { content: "Comparing Rust vs Go for our new backend service. Rust gives us memory safety without GC, but Go's simplicity means faster shipping. Decision matrix is surprisingly balanced. What would you pick?", imageSeed: null },
  { content: "Thrilled to announce I've joined @TechCompany as a Senior Engineer! Excited to work on their developer platform team and help shape the future of internal tooling. Big things ahead.", imageSeed: null },
  { content: "My take on AI in 2026: It's not going to replace developers, but it will change how we work. The most productive engineers I know use AI as a thinking partner, not a replacement. Embrace it wisely.", imageSeed: null },
  { content: "Just built a CI/CD pipeline with zero-downtime deployments. Blue-green strategy with automatic rollback on health check failure. The peace of mind this gives the team is immeasurable.", imageSeed: "post-cicd" },
  { content: "Book club recommendation: 'The Pragmatic Programmer' by Andy Hunt & Dave Thomas. Despite being decades old, so much of it is still relevant today. Some chapters feel like they were written this year.", imageSeed: null },
  { content: "Made traditional paella for the first time! The secret is getting the socarrat just right — that crispy caramelized rice at the bottom. Took 3 tries but I nailed it. Food > code sometimes.", imageSeed: "post-paella" },
  { content: "Visualizing our microservice architecture as a dependency graph was eye-opening. We had circular dependencies nobody knew about. A picture really is worth a thousand Slack messages.", imageSeed: null },
  { content: "Interviewing is broken. I've been on both sides of the table, and whiteboard coding under pressure doesn't reflect real-world skills. Let's talk about better hiring practices.", imageSeed: null },
  { content: "Finally understood monads. It only took me 5 years and 12 different tutorials. The trick is to stop trying to understand them and just use them. Functional programming is a journey, not a destination.", imageSeed: null },
  { content: "Our startup just closed our Series A! 🎉 $8M to build the future of collaborative development tools. So proud of the team and grateful to our investors who believe in our vision. We're hiring!", imageSeed: "post-seriesa" },
  { content: "The local farmers market on Saturday mornings is my weekly reset. Fresh produce, homemade bread, and community vibes. If you're remote, find a routine that grounds you outside of screens.", imageSeed: "post-market" },
  { content: "Just published a deep dive into WebAssembly performance benchmarks. Spoiler: it's fast, but Rust and C still have different tradeoffs than you might expect. Full analysis on my blog.", imageSeed: null },
  { content: "One year ago today I quit my job to freelance full-time. Best decision I ever made. Scary at first, but the freedom to choose my projects and schedule has been transformative.", imageSeed: null },
  { content: "Design systems are not just component libraries. They are a shared language between designers and developers. Investing in a good design system pays dividends in consistency and speed.", imageSeed: "post-design" },
  { content: "Spent the day mentoring at a coding bootcamp. The energy and curiosity of new developers is infectious. Reminded me why I fell in love with programming in the first place.", imageSeed: null },
  { content: "Performance optimization story: A single database index turned a 30-second query into 50 milliseconds. Indexing is both art and science. Know your query patterns before adding indexes.", imageSeed: null },
  { content: "My photostream from the Iceland road trip! Northern lights, glacial lagoons, and volcanic landscapes. Nature is the best UI designer. Cannot recommend this trip enough.", imageSeed: "post-iceland" },
  { content: "Rethinking error handling patterns in our codebase. We're moving away from try-catch spaghetti toward a more functional approach with Result types. Early feedback from the team is positive.", imageSeed: null },
  { content: "Just hit 10,000 contributions on GitHub. Not that numbers matter, but it's a nice reminder of consistency over time. Small commits every day add up to big impact.", imageSeed: null },
  { content: "Workshop today: 'Building accessible web applications'. Covered ARIA labels, keyboard navigation, screen reader testing, and color contrast. Accessibility is not optional — it's fundamental.", imageSeed: null },
  { content: "My cat just walked across my keyboard and deployed to production. Time to set up branch protection rules. 😅", imageSeed: null },
  { content: "Reflecting on 10 years in tech: the tools changed, the paradigms shifted, but the fundamentals remain. Problem-solving, communication, and empathy never go out of style.", imageSeed: null },
  { content: "Setting up a homelab this weekend! Old server rack + Proxmox + Kubernetes cluster. Because who doesn't want to run their own cloud? My electricity bill is going to hate me.", imageSeed: "post-homelab" },
  { content: "Just wrapped up a code review that was more like a design discussion. We ended up simplifying the architecture significantly. Best code reviews are collaborative, not combative.", imageSeed: null },
]

const COMMENTS_POOL = [
  "This is really impressive! Love the approach you took here.",
  "Great insights! I've been thinking about this too.",
  "Thanks for sharing your experience. Very helpful!",
  "I had a similar issue last month. Your solution is cleaner than mine.",
  "Could you elaborate on the caching strategy? Curious about your approach.",
  "Love this! Bookmarking for later reference.",
  "Been following your journey on this. Congrats on shipping!",
  "This is exactly what I needed to read today. Thank you!",
  "Have you considered the edge case where... never mind, you covered it in the follow-up.",
  "Respectfully disagree on this one. In my experience, a different approach worked better because...",
  "The timing of this post is perfect — I'm literally dealing with this right now.",
  "Wow, didn't know you could do that with TypeScript. TIL!",
  "Solid write-up. The diagrams really helped understand the architecture.",
  "How did you handle the migration without downtime? Would love to learn more.",
  "This deserves way more attention. Upvoted and shared.",
  "Just tried this pattern in our codebase. Works beautifully. Thanks for the tip!",
  "I appreciate how thorough this analysis is. Most articles gloss over these details.",
  "You make a compelling point about developer experience. I'm sold.",
  "That debugging story gave me second-hand anxiety. Glad you figured it out!",
  "Your desk setup is goals. What monitor arm are you using?",
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000 - Math.random() * 3600000)
}

function daysAgo(days: number): Date {
  return hoursAgo(days * 24)
}

async function main() {
  console.log("Clearing existing data...")
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

  const password = await bcrypt.hash("password123", 12)

  console.log("Creating 20 users...")
  const users = await Promise.all(
    USERS.map((u, i) =>
      prisma.user.create({
        data: {
          email: `${u.name.toLowerCase().replace(/\s+/g, ".")}@demo.com`,
          password,
          name: u.name,
          avatar: IMG(`avatar-${i}`, 200, 200),
          bio: u.bio,
          createdAt: daysAgo(randomBetween(30, 90)),
        },
      }),
    ),
  )

  console.log("Creating friendships...")
  const friendPairs = new Set<string>()
  for (const user of users) {
    const friends = pickN(users.filter((u) => u.id !== user.id), randomBetween(3, 7))
    for (const friend of friends) {
      const [a, b] = [user.id, friend.id].sort()
      const key = `${a}-${b}`
      if (!friendPairs.has(key)) {
        friendPairs.add(key)
        await prisma.friendship.create({
          data: { user1Id: a, user2Id: b, createdAt: daysAgo(randomBetween(15, 60)) },
        })
      }
    }
  }

  console.log("Creating pending friend requests...")
  const alreadyFriends = new Set<string>()
  friendPairs.forEach((k) => alreadyFriends.add(k))
  for (let i = 0; i < 8; i++) {
    const sender = pick(users)
    const receiver = pick(users.filter((u) => u.id !== sender.id))
    const [a, b] = [sender.id, receiver.id].sort()
    const key = `${a}-${b}`
    if (!alreadyFriends.has(key)) {
      alreadyFriends.add(key)
      await prisma.friendRequest.create({
        data: { senderId: sender.id, receiverId: receiver.id, status: "PENDING", createdAt: daysAgo(randomBetween(1, 5)) },
      })
    }
  }

  console.log("Creating 45 posts...")
  const posts: Awaited<ReturnType<typeof prisma.post.create>>[] = []
  for (let i = 0; i < POSTS.length; i++) {
    const p = POSTS[i]
    const author = pick(users)
    const post = await prisma.post.create({
      data: {
        content: p.content,
        imageUrl: p.imageSeed ? IMG(p.imageSeed, 600, 400) : null,
        visibility: ["PUBLIC", "PUBLIC", "PUBLIC", "PUBLIC", "FRIENDS"][randomBetween(0, 4)] as any,
        authorId: author.id,
        createdAt: hoursAgo(randomBetween(1, 720)),
        deletedAt: null,
      },
    })
    posts.push(post)
  }

  console.log("Creating comments...")
  for (const post of posts) {
    const commentCount = randomBetween(1, 6)
    for (let i = 0; i < commentCount; i++) {
      const author = pick(users.filter((u) => u.id !== (post as any).authorId))
      await prisma.comment.create({
        data: {
          content: pick(COMMENTS_POOL),
          postId: post.id,
          authorId: author.id,
          createdAt: hoursAgo(randomBetween(1, 24)),
        },
      })
    }
  }

  console.log("Creating replies to comments...")
  const allComments = await prisma.comment.findMany({ take: 100 })
  for (const comment of pickN(allComments, 15)) {
    const replier = pick(users.filter((u) => u.id !== comment.authorId))
    await prisma.comment.create({
      data: {
        content: pick(COMMENTS_POOL),
        postId: comment.postId,
        authorId: replier.id,
        parentId: comment.id,
        createdAt: hoursAgo(randomBetween(1, 12)),
      },
    })
  }

  console.log("Creating reactions...")
  const usedPostReactions = new Set<string>()
  for (const post of posts) {
    const reactors = pickN(users.filter((u) => u.id !== (post as any).authorId), randomBetween(1, 8))
    for (const reactor of reactors) {
      const type = pick(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"])
      const key = `${post.id}-${reactor.id}-${type}`
      if (!usedPostReactions.has(key)) {
        usedPostReactions.add(key)
        await prisma.reaction.create({
          data: { type: type as any, postId: post.id, userId: reactor.id, createdAt: hoursAgo(randomBetween(1, 48)) },
        })
      }
    }
  }

  const allCommentsForReactions = await prisma.comment.findMany({ take: 200 })
  const usedCommentReactions = new Set<string>()
  for (const comment of pickN(allCommentsForReactions, 30)) {
    const reactors = pickN(users.filter((u) => u.id !== comment.authorId), randomBetween(1, 4))
    for (const reactor of reactors) {
      const type = pick(["LIKE", "LOVE", "HAHA", "WOW"])
      const key = `${comment.id}-${reactor.id}-${type}`
      if (!usedCommentReactions.has(key)) {
        usedCommentReactions.add(key)
        await prisma.reaction.create({
          data: { type: type as any, commentId: comment.id, userId: reactor.id, createdAt: hoursAgo(randomBetween(1, 24)) },
        })
      }
    }
  }

  console.log("Creating stories...")
  for (const user of pickN(users, 8)) {
    await prisma.story.create({
      data: {
        imageUrl: IMG(`story-${user.id.slice(0, 8)}`, 400, 700),
        content: pick([
          "Good morning! 🌅",
          "Having a great day!",
          "Just landed! ✈️",
          "Coffee time ☕",
          "Work hard, play hard",
          "New adventure begins",
          null,
          null,
        ]),
        authorId: user.id,
        createdAt: hoursAgo(randomBetween(1, 20)),
      },
    })
  }

  console.log("Creating story views...")
  const usedViews = new Set<string>()
  const stories = await prisma.story.findMany()
  for (const story of stories) {
    const viewers = pickN(users.filter((u) => u.id !== story.authorId), randomBetween(2, 6))
    for (const viewer of viewers) {
      const key = `${story.id}-${viewer.id}`
      if (!usedViews.has(key)) {
        usedViews.add(key)
        await prisma.storyViewer.create({
          data: { storyId: story.id, userId: viewer.id, viewedAt: hoursAgo(randomBetween(0, 2)) },
        })
      }
    }
  }

  console.log("Creating events...")
  const events = [
    { title: "Tech Meetup: Building with AI", description: "Monthly meetup exploring practical AI applications in modern web development. Bring your laptop and ideas!", location: "Innovation Hub, 123 Tech Street", daysFromNow: 14 },
    { title: "Hackathon Weekend", description: "48-hour hackathon to build something amazing. Teams of 3-5. Prizes for best overall, best design, and most innovative.", location: "CoWork Space Downtown", daysFromNow: 21 },
    { title: "Design Systems Workshop", description: "Hands-on workshop covering design token architecture, component documentation, and cross-team collaboration strategies.", location: "Design Studio, Floor 3", daysFromNow: 7 },
    { title: "Friday Night Code & Coffee", description: "Casual coding session with good music, great coffee, and even better people. Work on side projects or learn something new.", location: "Bean & Byte Cafe", daysFromNow: 3 },
    { title: "Conference: DevFuture 2026", description: "Annual tech conference with tracks on AI, DevOps, Mobile, and Web. Speakers from top companies worldwide.", location: "Convention Center", daysFromNow: 45 },
    { title: "Open Source Sprint", description: "A day dedicated to contributing to open source projects. Mentors available for first-time contributors. Pizza provided!", location: "Tech Hub, Room 201", daysFromNow: 10 },
    { title: "Women in Tech Brunch", description: "Monthly networking brunch for women in technology. Share experiences, find mentors, and build community.", location: "The Garden Restaurant", daysFromNow: 5 },
    { title: "Cloud Infrastructure Deep Dive", description: "Expert-led session on modern cloud architecture patterns, cost optimization, and multi-cloud strategies.", location: "Virtual (Zoom)", daysFromNow: 12 },
  ]

  const createdEvents = await Promise.all(
    events.map((e, i) =>
      prisma.event.create({
        data: {
          title: e.title,
          description: e.description,
          imageUrl: IMG(`event-${i}`, 800, 400),
          location: e.location,
          startDate: new Date(Date.now() + e.daysFromNow * 86400000),
          endDate: new Date(Date.now() + (e.daysFromNow + 3) * 86400000),
          creatorId: pick(users).id,
          createdAt: daysAgo(randomBetween(10, 30)),
        },
      }),
    ),
  )

  console.log("Creating event RSVPs...")
  const usedRsvps = new Set<string>()
  for (const event of createdEvents) {
    const attendees = pickN(users, randomBetween(3, 10))
    for (const attendee of attendees) {
      const key = `${event.id}-${attendee.id}`
      if (!usedRsvps.has(key)) {
        usedRsvps.add(key)
        await prisma.eventAttendee.create({
          data: {
            eventId: event.id,
            userId: attendee.id,
            status: pick(["GOING", "GOING", "GOING", "MAYBE", "NOT_GOING"]) as any,
          },
        })
      }
    }
  }

  console.log("Creating notifications...")
  const notificationTypes = [
    { type: "FRIEND_ACCEPTED" as const, entityType: "FRIEND_REQUEST" as const },
    { type: "POST_REACTION" as const, entityType: "POST" as const },
    { type: "POST_COMMENT" as const, entityType: "COMMENT" as const },
    { type: "COMMENT_REPLY" as const, entityType: "COMMENT" as const },
    { type: "EVENT_INVITE" as const, entityType: "EVENT" as const },
  ]

  for (let i = 0; i < 50; i++) {
    const n = pick(notificationTypes)
    const actor = pick(users)
    const recipient = pick(users.filter((u) => u.id !== actor.id))
    const entityId = pick([...posts, ...createdEvents, ...allComments].map((e) => e.id))

    await prisma.notification.create({
      data: {
        userId: recipient.id,
        actorId: actor.id,
        type: n.type,
        entityType: n.entityType,
        entityId,
        isRead: Math.random() > 0.6,
        createdAt: hoursAgo(randomBetween(1, 168)),
      },
    })
  }

  console.log("Creating saved posts...")
  const usedSaved = new Set<string>()
  for (const user of pickN(users, 10)) {
    const savedPosts = pickN(posts, randomBetween(1, 4))
    for (const post of savedPosts) {
      const key = `${user.id}-${post.id}`
      if (!usedSaved.has(key)) {
        usedSaved.add(key)
        await prisma.savedPost.create({
          data: { userId: user.id, postId: post.id, createdAt: hoursAgo(randomBetween(1, 72)) },
        })
      }
    }
  }

  console.log("Creating hidden posts...")
  const usedHidden = new Set<string>()
  for (const user of pickN(users, 5)) {
    const hiddenPosts = pickN(posts, randomBetween(1, 2))
    for (const post of hiddenPosts) {
      const key = `${user.id}-${post.id}`
      if (!usedHidden.has(key)) {
        usedHidden.add(key)
        await prisma.hiddenPost.create({
          data: { userId: user.id, postId: post.id },
        })
      }
    }
  }

  console.log("\n✅ Seed complete!")
  console.log(`   ${users.length} users`)
  console.log(`   ${posts.length} posts`)
  console.log(`   ${friendPairs.size} friendships`)
  console.log(`   ${(await prisma.comment.count())} comments`)
  console.log(`   ${(await prisma.reaction.count())} reactions`)
  console.log(`   ${(await prisma.story.count())} stories`)
  console.log(`   ${createdEvents.length} events`)
  console.log(`   ${(await prisma.notification.count())} notifications`)
  console.log("\nAll users have password: password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
