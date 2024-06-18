import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const updateLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink, url, description, title, picUrl, short } = req.body;
  if (!idLink || !url || !title || !short) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const link = await prisma.link.update({
    where: {
      idLink: Number(idLink),
    },
    data: {
      url: url,
      description: description,
      title: title,
      short: short,
      picUrl:
        picUrl ?? "https://cdn-icons-png.flaticon.com/512/3541/3541854.png",
      updatedAt: new Date(),
    },
  });

  const deleteLinkTags = await prisma.linkTags.deleteMany({
    where: {
      idLink: Number(idLink),
    },
  });

  const { tags } = req.body;
  if (tags) {
    const newLinkTags = await prisma.linkTags.createMany({
      data: tags.map((tag: string) => ({
        idLink: Number(idLink),
        idTag: tag,
      })),
    });
  }

  res.status(200).json(link);
};

export default updateLink;
