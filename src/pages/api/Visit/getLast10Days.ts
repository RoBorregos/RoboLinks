import { prisma } from "../_db";
import { NextApiRequest, NextApiResponse } from "next";

const getLast10Days = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idLink } = req.query;

  if (!idLink) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const visits = await prisma.visit.groupBy({
    by: ["createdAt"],
    where: {
      idLink: Number(idLink),
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 10)),
      },
    },
    _count: {
      _all: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.status(200).json(visits);
};

export default getLast10Days;
