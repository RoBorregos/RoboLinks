import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idTag } = req.query;
  const tag = await prisma.tag.findUnique({
    where: {
      idTag: Number(idTag),
    },
  });
  res.status(200).json(tag);
};

export default getTag;
