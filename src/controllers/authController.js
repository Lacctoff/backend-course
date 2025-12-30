import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

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

  //Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //response on successful creation. you know that response you get when Joshua posts
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
  });

};

export { register };