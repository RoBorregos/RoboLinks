import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idUser } = req.query;
  const user = await prisma.user.delete({
    where: {
      idUser: Number(idUser),
    },
  });
  res.status(200).json(user);
};
// TODO: delete all user's posts, comments, likes, etc.
// TODO: export default deleteUser;
