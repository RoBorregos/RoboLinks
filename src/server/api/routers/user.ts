import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        username: z.string().nonempty(),
        email: z.string().email().nonempty(),
        password: z.string().nonempty(),
        picUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: {
          username: input.username,
          email: input.email.toLowerCase(),
          password: input.password,
          picUrl: input.picUrl ?? "",
        },
      });
    }),
  createValidUser: publicProcedure
    .input(
      z.object({
        username: z.string().nonempty(),
        email: z.string().email().nonempty(),
        password: z.string().nonempty(),
        picUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username, email, password, picUrl } = input;
      const count = await ctx.prisma.user.count({
        where: {
          OR: [{ username }, { email }],
        },
      });
      if (count > 0) {
        throw "User already exists";
      }
      return await ctx.prisma.user.create({
        data: {
          username: username,
          email: email.toLowerCase(),
          password: password,
          picUrl: picUrl ?? "",
        },
      });
    }),
  getUser: publicProcedure
    .input(
      z.object({
        idUser: z.number().int(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { idUser } = input;
      return await ctx.prisma.user.findUnique({
        where: {
          idUser: idUser,
        },
      });
    }),
});
