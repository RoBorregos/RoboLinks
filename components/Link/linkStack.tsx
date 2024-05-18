import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import client from "../../client";
import { LinkComponent } from "./LinkComponent";

const LinkStack = ({ search, tags, idUser }) => {
  const { data, isLoading, isError, isFetching } = useQuery(["links"], () =>
    client.post("/Link/searchLinks", {
      search: search,
      tags: tags,
    })
  );
  const [cols, setCols] = useState(3);

  useEffect(() => {
    //console.log(window.innerWidth);
    // 1320 = 3 columnas + 2 margenes + 2 espacios
    const handleResize = () => {
      const cols = window.innerWidth - 70;
      const cols2 = cols / 375;
      setCols(Math.floor(cols2));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  useEffect(() => {
    const cols = window.innerWidth - 70;
    const cols2 = cols / 375;
    setCols(Math.floor(cols2));
  }, []);

  const chunk = (arr, size) => {
    return Array.from(
      { length: Math.ceil(arr?.length / Math.max(0, size)) },
      (v, i) => arr.slice(i * size, i * size + size)
    );
  };
  const chunkedData = chunk(data?.data, isMobile ? 1 : cols);

  return (
    <>
      <VStack>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Text>Error</Text>
        ) : (
          <>
            {chunkedData.map((chunk, index) => (
              <HStack key={index} justify={"left"} w="90%" spacing={16}>
                {chunk.map((link) => (
                  <LinkComponent
                    key={link.idLink}
                    idLink={link.idLink}
                    idUser={idUser}
                  />
                ))}
              </HStack>
            ))}
          </>
        )}
      </VStack>
    </>
  );
};

export default LinkStack;
