import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getByShort = async (req: NextApiRequest, res: NextApiResponse) => {
  const { short } = req.query;
  console.log(short);
  const link = await prisma.link.findFirst({
    where: {
      short: {
        equals: String(short),
      },
    },
    select: {
      url: true,
      idLink: true,
    },
  });
  if (!link) return res.status(200).json({ error: "Link Not Found" });
  console.log(link);
  res.status(200).json(link);
};

export default getByShort;
