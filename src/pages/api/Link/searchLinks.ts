import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

// TODO make search with tags a intersection of tags and search results
const searchLinks = async (req: NextApiRequest, res: NextApiResponse) => {
  const { search, tags } = req.body;
  if (!tags || tags.length === 0) {
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
      },
      select: {
        idLink: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json(links);
  } else {
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
        AND: [
          {
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
        ],
      },
      select: {
        idLink: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json(links);
  }
};

export default searchLinks;
