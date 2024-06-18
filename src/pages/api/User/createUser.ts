import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, email, password, picUrl } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email.toLowerCase(),
      password: password,
      picUrl: picUrl ?? "", //TODO: add default pic
    },
  });
  res.status(200).json(user);
};

export default createUser;
