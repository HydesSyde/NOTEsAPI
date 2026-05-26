//regex for password. Requires uppercase, lowercase, number, special character and min of 8 characters
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signUp = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign up failed. Try Again" });
  }
};

const signIn = async () => {};

export { signUp, signIn };
