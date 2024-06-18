import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const validUserUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idUser, username, email, picUrl } = req.body;

  const count = await prisma.user.count({
    where: {
      AND: [
        {
          OR: [{ username }, { email }],
        },
        {
          NOT: {
            idUser: Number(idUser),
          },
        },
      ],
    },
  });

  if (count > 0) {
    res
      .status(201)
      .json({ message: "User already exists", title: "Invalid credentials" });
    return;
  }
  const user = await prisma.user.update({
    where: {
      idUser: Number(idUser),
    },
    data: {
      username: username,
      email: email,
      picUrl: picUrl,
    },
    select: {
      idUser: true,
    },
  });
  res.status(200).json(user);
};

export default validUserUpdate;
