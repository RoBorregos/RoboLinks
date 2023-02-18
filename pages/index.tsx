import { Container, Text, VisuallyHidden, VStack } from "@chakra-ui/react";
import { getCookie, hasCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { TopNavBar } from "../components/Layout/TopNavBar";
import LinkStack from "../components/Link/linkStack";
import SearchBar from "../components/Searcher/SearchBar";
import { trpc } from "../utils/trpc";
// idea https://excalidraw.com/#json=myQ7PbofUoi1ufoU6SZ65,jLB2YW1xcTTW4qktRK4V1w

export default function Home() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [idUser, setIdUser] = useState(null);
  useEffect(() => {
    if (hasCookie("RoboLinks")) {
      const cookies = getCookie("RoboLinks");
      setIdUser(cookies);
    }
  }, []);

  const hello = trpc.hello.useQuery({ text: "client" });
  console.log(hello);

  return (
    <>
      <VisuallyHidden>
        RoboLinks is a RoBorregos internal tool to share and manage links and
        resources.
        <Text>
          Check out our website at{" "}
          <Link href="https://roborregos.com">roborregos.com</Link>
        </Text>
      </VisuallyHidden>
      <VStack>
        <TopNavBar />
        <Container
          minW="100%"
          padding={isMobile ? "3.5rem" : "3rem"}
          background={"gray.700"}
          backdropBlur={"sm"}
          opacity={0}
        ></Container>
      </VStack>
      <VStack m="2%">
        <SearchBar
          setSearch={setSearch}
          setTags={setTags}
          search={search}
          idUser={idUser}
        />
      </VStack>
      <LinkStack search={search} tags={tags} idUser={idUser} />
    </>
  );
}
