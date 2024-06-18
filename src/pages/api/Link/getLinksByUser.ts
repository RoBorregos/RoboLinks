import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getLinksByUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idUser } = req.query;
  if (!idUser) {
    res
      .status(400)
      .json({ message: "Missing idUser", title: "Invalid request" });
    return;
  }
  const links = await prisma.link.findMany({
    where: {
      idUser: Number(idUser),
    },
    select: {
      idLink: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  res.status(200).json(links);
};

export default getLinksByUser;
