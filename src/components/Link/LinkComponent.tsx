import { CopyIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Modal,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import client from "../../utils/client";
import EditForm from "./EditForm";
import { useState, useEffect, useRef } from "react";

export const LinkComponent = ({ idLink, idUser }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // fetch if on screen
  const ref = useRef<HTMLInputElement>(null);
  const onScreen = useOnScreen(ref);

  const { data, isLoading, isError } = useQuery(
    ["link" + idLink],
    () => client.get(`Link/getLink?idLink=${idLink}`),
    { enabled: onScreen }
  );
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ["link" + idLink],
    (values) => client.post("/Link/updateLink", values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["link" + idLink]);
        queryClient.invalidateQueries(["links"]);
      },
    }
  );
  const handleEdit = (values) => {
    mutate(values);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <EditForm
          onClose={onClose}
          idLink={idLink}
          onSubmit={handleEdit}
          idUser={idUser ?? 1}
        />
      </Modal>
      <Box
        minW="350px"
        maxW={"350px"}
        w={"full"}
        //bg={"teal.800"}
        backdropBlur={"sm"}
        boxShadow={"md"}
        rounded={"md"}
        overflow={"hidden"}
        borderWidth={2}
        dropShadow={"md"}
        ref={ref}
      >
        <Box m="2%">
          {isLoading ? (
            <Box
              w="full"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner />
            </Box>
          ) : isError ? (
            <Text>Error</Text>
          ) : (
            <>
              <HStack>
                <VStack w="80px" h="80px">
                  <Image
                    src={data?.data?.picUrl}
                    alt="logo"
                    boxSize="80px"
                    borderRadius={"10%"}
                    shadow={"outline"}
                    w="full"
                  />
                </VStack>
                <VStack maxW="200px" alignItems={"left"}>
                  <Link
                    isExternal
                    onClick={() => {
                      router.push("/RoboLinkInfo/" + String(idLink));
                    }}
                  >
                    <Heading size="md">{data?.data?.title}</Heading>
                  </Link>
                  <Link href={data?.data?.url} isExternal w="110%">
                    <Text noOfLines={1}>
                      rbrgs.com/
                      {data?.data?.short.replaceAll(" ", "%20")}
                    </Text>
                  </Link>
                </VStack>
                <Spacer />
                <VStack alignSelf={"flex-start"}>
                  {idUser && (
                    <IconButton
                      aria-label="Edit Link"
                      icon={<EditIcon />}
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                      onClick={() => {
                        onOpen();
                      }}
                    />
                  )}
                  <IconButton
                    aria-label="Copy link"
                    icon={<CopyIcon />}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `rbrgs.com/${data?.data?.short?.replaceAll(" ", "%20")}`
                      );
                    }}
                    variant="outline"
                    size="sm"
                    colorScheme="teal"
                  />
                </VStack>
              </HStack>
              <HStack mt="2%" mb="2%" alignSelf={"flex-end"}>
                {data?.data?.tags.map((tag) => (
                  <Badge key={tag?.Tag?.idTag} colorScheme={tag?.Tag?.tagColor}>
                    {tag?.Tag?.tagName}
                  </Badge>
                ))}
              </HStack>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
};
