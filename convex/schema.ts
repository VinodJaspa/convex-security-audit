import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table with security and role-based access fields
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(), // Essential for Clerk/Auth0 integration
    role: v.union(v.literal("admin"), v.literal("user")),
    lastLogin: v.number(),
    isAccountActive: v.boolean(),
  }).index("by_token", ["tokenIdentifier"]),

  // Demonstrating relational data (Workspaces owned by Users)
workspaces: defineTable({
    name: v.string(),
    adminId: v.string(),
    settings: v.object({
      isPrivate: v.boolean(),
      tier: v.string(),
    }),
  }).index("by_admin", ["adminId"]),

  // Audit Logs - Proves your "Security-First" claim
  auditLogs: defineTable({
    action: v.string(),
    userId: v.string(),
    timestamp: v.number(),
    ipAddress: v.optional(v.string()),
    metadata: v.any(),
  }).index("by_user_time", ["userId", "timestamp"]),
});