import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getByLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink } = req.query;
  const linksTags = await prisma.linkTags.findMany({
    where: {
      idLink: Number(idLink),
    },
    include: {
      Tag: true,
    },
  });
  res.status(200).json(linksTags);
};

export default getByLink;
