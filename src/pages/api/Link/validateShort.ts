import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const validateShort = async (req: NextApiRequest, res: NextApiResponse) => {
  const { short, idLink } = req.body;
  const link = await prisma.link.findMany({
    where: {
      short: {
        equals: short,
      },
      idLink: {
        not: idLink ?? 0,
      },
    },
    select: {
      idLink: true,
    },
  });
  res.status(200).json(!(link.length > 0));
};

export default validateShort;
