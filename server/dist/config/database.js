"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const env_1 = require("./env");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: env_1.env.DATABASE_URL });
const prisma = new prisma_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=database.js.map