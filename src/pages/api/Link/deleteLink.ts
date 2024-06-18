import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const deleteLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink } = req.query;
  const link = await prisma.link.delete({
    where: {
      idLink: Number(idLink),
    },
  });
  res.status(200).json(link);
};

export default deleteLink;
