import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { users } from "../schema/user.js";
import { eq } from "drizzle-orm";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import {
  userSignInValidator,
  userSingUpValidator,
} from "../validator/auth.validator.js";

//regex for password. Requires uppercase, lowercase, number, special character and min of 8 characters
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// --SIGNUP--
const signUp = async (req, res) => {
  try {
    const { fullName, email, passWord } = userSingUpValidator.parse(req.body);

    if (!fullName || !passWord || !email) {
      return res.status(400).json({
        message: "No input found",
      });
    }

    //check for already existing user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    //if user exist, registration fails
    if (existingUser.length) {
      return res.status(409).json({
        message: "Email already exists",
        success: false,
      });
    }

    //test for password input
    if (!passwordRegex.test(passWord)) {
      return res.status(400).json({
        message: "Password validation failed",
      });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(passWord, 10);

    //if all passes create successful user
    const newUser = await db
      .insert(users)
      .values({
        fullName,
        email,
        passWord: hashedPassword,
        role: "user",
        refreshToken: "",
        resetToken: "",
      })
      .returning();

    //token from jwt
    const token = generateAccessToken(newUser);

    res.status(201).json({
      message: "Sign-up successful",
      token,
      user: newUser[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign up failed.Internal Server Error" });
  }
};

// --SIGNIN--
const signIn = async (req, res) => {
  try {
    //validate user input
    const { email, passWord } = userSignInValidator.parse(req.body);

    //check if user exists in db
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!foundUser.length) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    //check for correct password by comparing using bcrypt
    const correctPassword = await bcrypt.compare(
      passWord,
      foundUser[0].passWord,
    );

    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //generate access token
    const token = generateAccessToken(foundUser[0]);

    //generate refreshToken
    const refreshToken = generateRefreshToken(foundUser[0]);

    //add to database
    await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.id, foundUser[0].id));

    res
      .status(201)
      .json({ message: "User sign in successfully", token, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign in failed.Internal Server Error" });
  }
};

export { signUp, signIn };
