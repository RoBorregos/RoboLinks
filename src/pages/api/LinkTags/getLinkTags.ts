import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getLinkTags = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink } = req.query;
  const linkTags = await prisma.linkTags.findMany({
    where: {
      idLink: Number(idLink),
    },
  });
  res.status(200).json(linkTags);
};

export default getLinkTags;
