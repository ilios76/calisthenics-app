import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

// In-memory storage for demo (replace with database in production)
const shareEvents: Array<{
  userId: number;
  achievementType: string;
  platform: string;
  timestamp: Date;
}> = [];

export const sharingRouter = router({
  // Track when user shares an achievement
  trackShare: protectedProcedure
    .input(
      z.object({
        achievementType: z.enum(["streak", "pr", "milestone", "level"]),
        platform: z.enum(["instagram", "tiktok", "download"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      shareEvents.push({
        userId: ctx.user.id,
        achievementType: input.achievementType,
        platform: input.platform,
        timestamp: new Date(),
      });

      return { success: true };
    }),

  // Get sharing stats for user
  getShareStats: protectedProcedure.query(({ ctx }) => {
    const userShares = shareEvents.filter((e) => e.userId === ctx.user.id);
    const platformCounts = userShares.reduce(
      (acc, e) => {
        acc[e.platform] = (acc[e.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalShares: userShares.length,
      platforms: platformCounts,
      lastShare: userShares[userShares.length - 1]?.timestamp || null,
    };
  }),

  // Get referral code for user (for tracking organic growth)
  getReferralCode: protectedProcedure.query(({ ctx }) => {
    // Generate a simple referral code based on user ID
    const code = `CAL${ctx.user.id}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return { code };
  }),
});
