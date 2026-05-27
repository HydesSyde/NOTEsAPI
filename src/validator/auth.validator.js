import z from "zod";

//validating user sign up
const userSingUpValidator = z.object({
  fullName: z.string().min(3),
  email: z.email(),
  passWord: z.string().min(8),
});

//validating user sign in
const userSignInValidator = z.object({
  email: z.email(),
  passWord: z.string().min(8),
});

export { userSingUpValidator, userSignInValidator };
