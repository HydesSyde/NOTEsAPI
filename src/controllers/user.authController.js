import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { users } from "../schema/user.js";

//regex for password. Requires uppercase, lowercase, number, special character and min of 8 characters
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// --SIGNUP--
const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !password || !email) {
      return res.status(400).json({
        message: "No input found",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password validation failed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        fullName,
        email,
        password: hashedPassword,
      })
      .returning();

    //token from jwt
    const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Sign-up successful",
      token,
      user: newUser[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign up failed. Try Again" });
  }
};

// --SIGNIN--
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!foundUser.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const correctPassword = await bcrypt.compare(
      password,
      foundUser[0].password,
    );

    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: foundUser[0].id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "User sign in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign in failed. Try Again" });
  }
};

export { signUp, signIn };
