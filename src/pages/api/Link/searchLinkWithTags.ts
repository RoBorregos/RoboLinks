import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const searchLinkWithTags = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { search, tags } = req.body;
  const links = await prisma.link.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
        {
          url: {
            contains: search,
          },
        },
        {
          User: {
            username: {
              contains: search,
            },
          },
        },
        {
          LinkTags: {
            some: {
              Tag: {
                tagName: {
                  contains: search,
                },
              },
            },
          },
        },
      ],
      LinkTags: {
        some: {
          Tag: {
            idTag: {
              in: tags,
            },
          },
        },
      },
    },
    select: {
      idLink: true,
    },
  });
  res.status(200).json(links);
};

export default searchLinkWithTags;
