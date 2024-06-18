import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idUser, username, email, password, picUrl } = req.body;
  if (!idUser || !username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const user = await prisma.user.update({
    where: {
      idUser: Number(idUser),
    },
    data: {
      username: username,
      email: email.toLowerCase(),
      password: password,
      picUrl: picUrl ?? "", //TODO: add default pic
    },
  });
  res.status(200).json(user);
};

export default updateUser;
