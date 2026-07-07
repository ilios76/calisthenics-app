import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";

const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365];

export const streakRouter = router({
  // Get user's current streak
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const streak = await db.getUserStreak(ctx.user.id);
    return streak || {
      currentStreak: 0,
      longestStreak: 0,
      milestonesReached: "",
    };
  }),

  // Record activity and update streak
  recordActivity: protectedProcedure
    .input(z.object({ workoutId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const streak = await db.getUserStreak(ctx.user.id);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let newStreak = 1;
      if (streak && streak.lastActivityDate) {
        const lastActivity = new Date(streak.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor(
          (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 0) {
          // Already recorded today
          return { currentStreak: streak.currentStreak };
        } else if (daysDiff === 1) {
          // Streak continues
          newStreak = streak.currentStreak + 1;
        }
        // else: streak broken, reset to 1
      }

      // Update streak
      await db.updateStreak(ctx.user.id, newStreak);

      // Check for milestones
      const reachedMilestone = STREAK_MILESTONES.find((m) => m === newStreak);
      if (reachedMilestone) {
        await db.recordMilestone(ctx.user.id, reachedMilestone);

        // Send notification for milestone
        await notifyOwner({
          title: `🔥 Streak Milestone: ${reachedMilestone} days!`,
          content: `User ${ctx.user.name} reached a ${reachedMilestone}-day streak!`,
        });
      }

      return { currentStreak: newStreak, milestonReached: reachedMilestone };
    }),

  // Reset streak (admin only)
  resetStreak: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Only allow resetting own streak or admin resetting others
      if (ctx.user.id !== input.userId && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await db.updateStreak(input.userId, 0);
      return { success: true };
    }),
});
