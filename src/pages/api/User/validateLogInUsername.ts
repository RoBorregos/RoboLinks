import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const validateLogInUsername = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { username, password } = req.body;
  const user = await prisma.user.findMany({
    where: {
      username: {
        equals: username,
      },
      password: {
        equals: password,
      },
    },
    select: {
      idUser: true,
    },
  });
  res.status(200).json(user);
};

export default validateLogInUsername;
