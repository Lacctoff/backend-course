import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  // get the name,email and password from the req body first of all
  const { name, email, password } = req.body;

  console.log(name, password, email);

  // need to check if that user exists using the findUnique() of the email from the database
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  //Hash Password requires that you salt and then hash the password...
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create User in the data base
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate the JWT
  const token = generateToken(user.id);

  //response on successful creation. you know that response you get when Joshua posts
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
      token,
    },
  });

};

const login = async (req, res) => {
  // get the req body
  const { email, password } = req.body;

  //check if email exists in the db table
  const user = await prisma.user.findUnique({
    where: {email: email},
  });

  //if the user does not exist return and error
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Verify the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate the JWT
  const token = generateToken(user.id, res);

  res.status(201).json({
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    },
  })
}


const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};


export { register, login, logout };