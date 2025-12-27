import { prisma } from "../config/db.js";

const register = async (req, res) => {
  // get the name,email and password from the req body first of all
  const { name, email, password } = req.body;

  // need to check if that user exists using the findUnique() of the email from the database
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  })

  if (userExists) {
    return res.status(400).json({error: "User already exists with this email"})
  }

  //Hash Password

};

export { register };