import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getUserByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  if (!email || email === "null" || email === "undefined") {
    res
      .status(400)
      .json({ message: "Missing email", title: "Invalid request" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      email: String(email),
    },
  });
  res.status(200).json(user);
};

export default getUserByEmail;
