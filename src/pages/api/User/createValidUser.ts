import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const createValidUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, email, password, picUrl } = req.body;

  const count = await prisma.user.count({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (count > 0) {
    res
      .status(201)
      .json({ message: "User already exists", title: "Invalid credentials" });
    return;
  }
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
      picUrl: picUrl,
    },
    select: {
      idUser: true,
    },
  });
  res.status(200).json(user);
};

export default createValidUser;
