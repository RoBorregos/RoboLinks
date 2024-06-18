import { CopyIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Code,
  Container,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import client from "rbrgs/utils/client";
import VisitsDateHistogram from "rbrgs/components/DataVisualization/VisitsByDateHistogram";
import VisitsHistogram from "rbrgs/components/DataVisualization/VisitsHistogram";
import { TopNavBar } from "rbrgs/components/Layout/TopNavBar";
import { QRCode } from "react-qrcode-logo";

const LinkPage = () => {
  const router = useRouter();
  const { idLink } = router.query;
  const { data, isLoading, error } = useQuery(["link", idLink], () =>
    client.get(`/Link/getLink?idLink=${idLink}`)
  );

  const autor = useQuery(["autor", data?.data?.idUser], () =>
    client.get(`/User/getUser?idUser=${data?.data?.idUser}`)
  );

  useEffect(() => {
    if (error) {
      router.push("/");
    }
  }, [error]);
  return (
    <>
      <VStack minW="100%">
        <TopNavBar />
        <Container
          minW="100%"
          padding={isMobile ? "3.5rem" : "3rem"}
          background={"gray.700"}
          backdropBlur={"sm"}
          opacity={0}
        ></Container>
      </VStack>
      <HStack align={"flex-start"} m="5%" spacing={8}>
        <VStack>
          <Image
            src={data?.data?.picUrl}
            alt={data?.data?.title}
            borderRadius="20%"
            border={"2px"}
            boxSize="400px"
            minH={"400px"}
            minW={"400px"}
          />
        </VStack>
        <VStack align={"left"} m="5%" spacing={4} minW="30%" minH="40%">
          <Heading>{data?.data?.title}</Heading>
          {/** Author info */}
          <HStack>
            <Avatar
              size={"md"}
              name={autor?.data?.data?.username}
              src={autor?.data?.data?.picUrl}
            />
            <Code fontSize={"lg"}>{autor?.data?.data?.username}</Code>
          </HStack>
          <HStack>
            <Link href={data?.data?.url} isExternal>
              <Code>
                rbrgs.com/
                {data?.data?.short?.replaceAll(" ", "%20")}
              </Code>
            </Link>
            <IconButton
              aria-label="Copy link"
              icon={<CopyIcon />}
              onClick={() => {
                navigator.clipboard.writeText(
                  `rbrgs.com/${data?.data?.short?.replaceAll(" ", "%20")}`
                );
              }}
            />
          </HStack>
          <Box w={"100%"} border="2px" minH="60%" padding={"3rem"} maxH="60%">
            <Text>{data?.data?.description}</Text>
          </Box>
          <Link>
            <Text>{data?.data?.url}</Text>
          </Link>
          <HStack mt="2%" mb="2%" alignSelf={"flex-start"}>
            {data?.data?.tags.map((tag) => (
              <Badge key={tag?.Tag?.idTag} colorScheme={tag?.Tag?.tagColor}>
                {tag?.Tag?.tagName}
              </Badge>
            ))}
          </HStack>
        </VStack>
        {!isMobile && (
          <QRCode
            value={`rbrgs.com/${data?.data?.short}`}
            size={256}
            logoImage={"/logo_fondoBlanco_cuadrado.png"}
          />
        )}
      </HStack>
      <VStack align={"flex-start"} m="5%" spacing={8}>
        <Heading>Analytics</Heading>
        <HStack align={"left"} m="5%" spacing={4} minW="80%" minH="60%">
          <Box w={"100%"} border="2px" minH="60%" padding={"3rem"} maxH="60%">
            <Code>Visits by Country:</Code>
            <VisitsHistogram idLink={idLink} />
          </Box>
          <Box
            w={"100%"}
            border="2px"
            minH="60%"
            padding={"3rem"}
            maxH="60%"
            justifyItems={"center"}
            flex="100%"
          >
            <Code>Visits by Date:</Code>
            <Spacer />
            <VisitsDateHistogram idLink={idLink} />
            <Spacer />
          </Box>
        </HStack>
      </VStack>
    </>
  );
};

export default LinkPage;
