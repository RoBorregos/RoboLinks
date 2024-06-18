import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const UndefinedPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/404/404");
  }, []);
  return <Spinner />;
};

export default UndefinedPage;
