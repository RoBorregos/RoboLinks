import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const createLinkTags = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink, tags } = req.body;
  const linkTags = await prisma.linkTags.createMany({
    data: tags.map((tag) => ({
      idLink: Number(idLink),
      idTag: Number(tag),
    })),
  });
  res.status(200).json(linkTags);
};

export default createLinkTags;
