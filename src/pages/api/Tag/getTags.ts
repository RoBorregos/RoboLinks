import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  const tags = await prisma.tag.findMany();
  res.status(200).json(tags);
};

export default getTags;
