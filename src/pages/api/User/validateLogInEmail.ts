import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const validateLogInEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findMany({
    where: {
      email: {
        equals: email,
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

export default validateLogInEmail;
