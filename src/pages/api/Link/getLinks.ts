import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getLinks = async (req: NextApiRequest, res: NextApiResponse) => {
  const links = await prisma.link.findMany({
    include: {
      LinkTags: {
        select: {
          Tag: {
            select: {
              idTag: true,
              tagName: true,
              tagColor: true,
            },
          },
        },
      },
    },
  });
  res.status(200).json(links);
};

export default getLinks;
