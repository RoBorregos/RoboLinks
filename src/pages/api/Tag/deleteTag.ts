import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const deleteTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idTag } = req.query;
  const tag = await prisma.tag.delete({
    where: {
      idTag: Number(idTag),
    },
  });
  res.status(200).json(tag);
};

export default deleteTag;
