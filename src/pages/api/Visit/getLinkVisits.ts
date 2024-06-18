import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getLinkVisits = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink } = req.query;

  if (!idLink) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const visits = await prisma.visit.findMany({
    where: {
      idLink: Number(idLink),
    },
  });

  res.status(200).json(visits);
};

export default getLinkVisits;
