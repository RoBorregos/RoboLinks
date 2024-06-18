import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink } = req.query;
  if (idLink == "undefined") {
    return {};
  }
  const link = await prisma.link.findUnique({
    where: {
      idLink: Number(idLink),
    },
  });
  const tags = await prisma.linkTags.findMany({
    where: {
      idLink: Number(idLink),
    },
    select: {
      Tag: {
        select: {
          idTag: true,
          tagName: true,
          tagColor: true,
        },
      },
    },
  });
  const linkWithTags = {
    ...link,
    tags: tags,
  };
  if (link) {
    res.status(200).json(linkWithTags);
  } else {
    res.status(404).json(null);
  }
};

export default getLink;
