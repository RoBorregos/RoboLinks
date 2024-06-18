import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const updateTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idTag, tagName, tagColor } = req.body;

  if (!idTag || !tagName || !tagColor) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const tag = await prisma.tag.update({
    where: {
      idTag: Number(idTag),
    },
    data: {
      tagName: tagName,
      tagColor: tagColor,
    },
  });
  res.status(200).json(tag);
};

export default updateTag;
