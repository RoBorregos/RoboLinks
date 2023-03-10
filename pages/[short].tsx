import { Spinner } from "@chakra-ui/react";
import client from "../client";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const short = context.params.short;
  String(short).replaceAll("%20", " ");
  const response = await client.get(`/Link/getByShort?short=${short}`);
  if (response.data.error != null) {
    console.log("error", response.data.error);
    return {
      notFound: true,
    };
  }
  const url = response?.data?.url;
  const idLink = response?.data?.idLink;

  const ip =
    context?.req?.headers?.["x-forwarded-for"] ||
    context?.req?.socket?.remoteAddress ||
    null;
  return {
    redirect: {
      destination: url,
      permanent: true,
    },
    async then(onfulfilled, onrejected) {
      await client.post("/Visit/createVisit", {
        ip: ip,
        idLink: idLink,
      });
    },
  };
};

export const LinkPage = () => {
  return <Spinner />;
};

export default LinkPage;
