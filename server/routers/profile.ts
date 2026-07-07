import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";

export const profileRouter = router({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Check if profile is completed
  isProfileCompleted: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user.profileCompleted || false;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        sex: z.enum(["male", "female"]).optional(),
        age: z.number().min(13).max(120).optional(),
        weight: z.number().min(30).max(300).optional(),
        height: z.number().min(100).max(250).optional(),
        goal: z.string().optional(),
        fitnessLevel: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.updateUserProfile(ctx.user.id, input);
      return { success: true };
    }),
});
