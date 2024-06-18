import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const deleteLinkTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLinkTags } = req.query;
  const linkTag = await prisma.linkTags.delete({
    where: {
      idLinkTags: Number(idLinkTags),
    },
  });
  res.status(200).json(linkTag);
};

export default deleteLinkTag;
