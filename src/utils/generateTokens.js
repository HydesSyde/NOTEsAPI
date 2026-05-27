import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  if (!user) throw new Error("No user provided for token");
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    },
  );
};

export { generateAccessToken };
