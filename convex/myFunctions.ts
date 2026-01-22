import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSecureWorkspace = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated: Security protocols require a valid session.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Insufficient permissions for this action.");
    }

    return await ctx.db.insert("workspaces", {
      name: args.name,
      adminId: user._id,
      settings: { isPrivate: true, tier: "free" },
    });
  },
});