import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const createLinkTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink, idTag } = req.body;
  const linksTags = await prisma.linkTags.create({
    data: {
      idLink: Number(idLink),
      idTag: Number(idTag),
    },
  });
  res.status(200).json(linksTags);
};

export default createLinkTag;
