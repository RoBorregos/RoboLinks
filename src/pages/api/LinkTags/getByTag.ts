import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getByTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idTag } = req.query;
  const linksTags = await prisma.linkTags.findMany({
    where: {
      idTag: Number(idTag),
    },
    include: {
      Link: true,
    },
  });
  res.status(200).json(linksTags);
};

export default getByTag;
