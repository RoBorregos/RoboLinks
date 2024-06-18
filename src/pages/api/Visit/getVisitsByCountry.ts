import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getVisitsByCountry = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { idLink } = req.query;

  if (!idLink) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const visits = await prisma.visit.groupBy({
    by: ["country"],
    where: {
      idLink: Number(idLink),
    },
    _count: {
      _all: true,
    },
    orderBy: {
      country: "asc",
    },
  });

  res.status(200).json(visits);
};

export default getVisitsByCountry;
