import { Spinner } from "@chakra-ui/react";
import client from "../client";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const short = context.params.short;
  String(short).replaceAll("%20", " ");
  const response = await client.get(`/Link/getByShort?short=${short}`);
  if (response.data.error != null) {
    console.log("error");
    return {
      notFound: true,
    };
  }
  const ip =
    context?.req?.headers?.["x-forwarded-for"] ||
    context?.req?.socket?.remoteAddress ||
    null;
  const url = response?.data?.url;
  const idLink = response?.data?.idLink;
  client.post("/Visit/createVisit", {
    ip: ip,
    idLink: idLink,
  });
  return {
    redirect: {
      destination: url,
      permanent: true,
    },
  };
};

export const LinkPage = () => {
  return <Spinner />;
};

export default LinkPage;
