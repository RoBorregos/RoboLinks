import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const createTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tagName, tagColor } = req.body;
  const tag = await prisma.tag.create({
    data: {
      tagName: tagName,
      tagColor: tagColor,
    },
  });
  res.status(200).json(tag);
};

export default createTag;
