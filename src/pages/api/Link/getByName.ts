import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getByName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.query;
  const link = await prisma.link.findFirst({
    where: {
      title: {
        equals: String(title),
      },
    },
    select: {
      url: true,
    },
  });
  res.status(200).json(link);
};

export default getByName;
