import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Center,
  Code,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalContent,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import client from "../../client";
import CreateTag from "./CreateTag";
import { useMsal } from "@azure/msal-react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { loginRequest } from "../../authConfig";

type props = {
  idLink?: number;
  onClose: () => void;
  onSubmit: (values: any) => any;
  idUser: number;
};

const EditForm = ({ idLink, onClose, onSubmit, idUser }: props) => {
  const toast = useToast();
  const router = useRouter();
  const createTagDisclosure = useDisclosure();

  const supabaseLink = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase = createClient(supabaseLink, supabaseKey);
  const [selectedTags, setSelectedTags] = useState(new Set() as Set<number>);
  const [isSelected, setIsSelected] = useState({});

  const tagsQuery = useQuery(["tags"], () => client.get("/Tag/getTags"));
  const { data, isLoading, isError, isFetching } = useQuery(
    ["link" + idLink],
    async () => await client.get(`Link/getLink?idLink=${idLink}`)
  );
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required")
      .matches(/^[a-zA-Z0-9 ]*$/, "Only alphanumeric characters and spaces"),
    short: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required")
      // only alphanumeric characters and spaces
      .matches(/^[a-zA-Z0-9 ]*$/, "Only alphanumeric characters and spaces"),
    url: Yup.string().url("Invalid url").required("Required"),
    description: Yup.string().max(500, "Too Long!"), //change required here and in the backend
  });

  useEffect(() => {
    if (data) {
      setSelectedTags(new Set(data?.data?.tags.map((tag) => tag?.Tag?.idTag)));
    }
  }, [data]);
  const { instance } = useMsal();
  const handleLogin = async () => {
    try {
      await instance.initialize();
      const loginResponse = await instance.loginPopup(loginRequest);
      if (loginResponse?.account?.username) {
        instance.setActiveAccount(loginResponse.account);
        const user = await client.post("/User/getUserByEmail", {
          email: loginResponse.account.username,
        });
        if (user.status === 200) {
          if (user.data) {
            setCookie("RoboLinks", user.data.idUser);
            router.reload();
          } else {
            router.push(
              {
                pathname: "/register",
                query: { email: loginResponse.account.username },
              },
              "/register"
            );
          }
        } else {
          toast({
            title: "Error.",
            description: "Something went wrong.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          //sessionStorage.removeItem("msal.interaction.status");
        }
      }
    } catch (e) {
      console.error(e);
      //sessionStorage.removeItem("msal.interaction.status");
    }
  };

  return (
    <>
      <ModalContent minW="60%" minH="40%">
        <ModalBody>
          {idUser ? (
            <Formik
              initialValues={
                idLink
                  ? data?.data
                  : {
                      title: "",
                      short: "",
                      url: "",
                      picUrl:
                        "https://cdn-icons-png.flaticon.com/512/3541/3541854.png",
                      description: "",
                      changable: true,
                    }
              }
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const validShort = await client.post("/Link/validateShort", {
                  short: values.short,
                  idLink: idLink ?? null,
                });
                if (!validShort?.data) {
                  toast({
                    title: "Short already exists",
                    position: "top",
                    status: "error",
                    isClosable: true,
                  });
                  return;
                }
                values.idLink = idLink;
                if (values.picUrl.substring(0, 4) == "data") {
                  const base64 = await fetch(values.picUrl);
                  const blob = await base64.blob();
                  const supabaseImagesNumber = await supabase.storage
                    .from("imagenes")
                    .list("RoboLinks");
                  const num = supabaseImagesNumber?.data?.length ?? 0;
                  supabase.storage
                    .from("imagenes")
                    .upload("RoboLinks/" + num + ".png", blob);
                  values.picUrl =
                    process.env.NEXT_PUBLIC_SUPABASE_URL +
                    "/storage/v1/object/public/imagenes/RoboLinks/" +
                    num +
                    ".png";
                }
                values.idUser = idUser; //TODO change this
                values.tags = Array.from(selectedTags);
                onSubmit(values);
                setSubmitting(false);

                onClose();
              }}
            >
              {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                <Form>
                  <VStack minW="100%" w="90%" alignItems={"flex-start"}>
                    <HStack justify={"space-between"} m="2.5%" w="30%">
                      <VStack
                        w="100%"
                        h="100%"
                        justify={"space-between"}
                        align={"flex-start"}
                        mr="2%"
                      >
                        <Image
                          src={
                            values?.picUrl ?? "" //if picUrl is null, then show a default image
                          }
                          alt="logo"
                          boxSize="150px"
                          borderRadius={"10%"}
                          shadow={"outline"}
                        />
                        <Field
                          name="picUrl"
                          as={Input}
                          placeholder="Image Url"
                          onChange={(e) => {
                            setFieldValue("picUrl", e.target.value);
                          }}
                        />
                        <input
                          type="file"
                          name="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onloadend = async () => {
                              setFieldValue("picUrl", reader.result);
                            };
                          }}
                        />
                      </VStack>
                      <VStack minW="210%" h="100%" alignItems={"self-start"}>
                        <HStack w="100%" justify={"space-between"}>
                          <Code>
                            <Heading size="md">Title</Heading>
                          </Code>
                          <IconButton
                            aria-label="Close"
                            icon={<CloseIcon />}
                            onClick={onClose}
                          />
                        </HStack>
                        <FormControl
                          isInvalid={Boolean(!!errors.title && touched.title)}
                        >
                          <Field
                            name="title"
                            as={Input}
                            placeholder="Title"
                            onChange={(e) => {
                              setFieldValue("title", e.target.value);
                              if (values.changable) {
                                setFieldValue("short", e.target.value);
                              }
                            }}
                            required
                          />
                          <FormHelperText>
                            {errors.title &&
                              touched.title &&
                              errors?.title.toString()}
                          </FormHelperText>
                        </FormControl>
                        <FormControl
                          isInvalid={Boolean(!!errors.short && touched.short)}
                        >
                          <Field
                            name="short"
                            as={Input}
                            placeholder="Short"
                            onChange={(e) => {
                              setFieldValue("short", e.target.value);
                              if (e.target.value.length == 0) {
                                setFieldValue("changable", true);
                              } else {
                                setFieldValue("changable", false);
                              }
                            }}
                            required
                          />
                          <FormHelperText>
                            {errors.short &&
                              touched.short &&
                              errors?.short.toString()}
                          </FormHelperText>
                        </FormControl>
                        {values?.short && (
                          <Code fontSize="md">
                            rbrgs.com/
                            {values?.short.replaceAll(" ", "%20")}
                          </Code>
                        )}

                        <Code>
                          <Heading size="md">Url</Heading>
                        </Code>
                        <FormControl
                          isInvalid={Boolean(!!errors.url && touched.url)}
                        >
                          <Field
                            name="url"
                            as={Input}
                            placeholder="Url"
                            required
                          />
                          <FormHelperText>
                            {errors.url &&
                              touched.url &&
                              errors?.url.toString()}
                          </FormHelperText>
                        </FormControl>
                        <Code>
                          <Heading size="md">Description</Heading>
                        </Code>
                        <FormControl
                          isInvalid={Boolean(
                            !!errors.description && touched.description
                          )}
                        >
                          <Field
                            name="description"
                            as={Textarea}
                            placeholder="Description"
                          />
                          <FormHelperText>
                            {errors.description &&
                              touched.description &&
                              errors?.description.toString()}
                          </FormHelperText>
                        </FormControl>
                        <HStack maxW="90%">
                          <Menu>
                            <MenuButton type="button">
                              <Badge colorScheme={"green"}>Tags</Badge>
                            </MenuButton>
                            <MenuList>
                              {tagsQuery?.data?.data?.map((tag) => {
                                return (
                                  <MenuItem
                                    key={tag.idTag}
                                    onClick={() => {
                                      setIsSelected({
                                        ...isSelected,
                                        [tag.idTag]: true,
                                      });
                                      selectedTags.add(tag.idTag);
                                      setSelectedTags(selectedTags);
                                    }}
                                  >
                                    <HStack justify={"space-between"}>
                                      <Badge colorScheme={tag.tagColor}>
                                        {tag.tagName}
                                      </Badge>
                                      <Spacer />
                                      {isSelected[tag.idTag] ? (
                                        <CheckIcon />
                                      ) : null}
                                    </HStack>
                                  </MenuItem>
                                );
                              })}
                            </MenuList>
                          </Menu>
                          <Popover
                            isOpen={createTagDisclosure.isOpen}
                            onClose={createTagDisclosure.onClose}
                          >
                            <PopoverTrigger>
                              <IconButton
                                aria-label="Create tag"
                                icon={<AddIcon />}
                                onClick={createTagDisclosure.onOpen}
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverHeader>Create tag</PopoverHeader>
                              <PopoverCloseButton
                                onClick={createTagDisclosure.onClose}
                              />
                              <PopoverBody>
                                <CreateTag
                                  onClose={createTagDisclosure.onClose}
                                />
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                          <HStack>
                            {Array.from(selectedTags).map((tag) => {
                              const tagData = tagsQuery?.data?.data?.find(
                                (t) => t.idTag === tag
                              );
                              return (
                                <Badge
                                  key={tagData?.idTag}
                                  colorScheme={tagData?.tagColor}
                                  onClick={() => {
                                    setIsSelected({
                                      ...isSelected,
                                      [tagData.idTag]: false,
                                    });
                                    selectedTags.delete(tagData.idTag);
                                    setSelectedTags(selectedTags);
                                  }}
                                  cursor={"pointer"}
                                >
                                  <HStack>
                                    <Text>{tagData.tagName}</Text>
                                    <Center>
                                      <CloseIcon />
                                    </Center>
                                  </HStack>
                                </Badge>
                              );
                            })}
                          </HStack>
                        </HStack>
                      </VStack>
                    </HStack>

                    <HStack minW="100%" m="3%">
                      <Button
                        type="submit"
                        colorScheme={"blue"}
                        isLoading={isSubmitting}
                      >
                        Submit
                      </Button>{" "}
                      <Spacer /> <Button onClick={onClose}>Cancel</Button>
                    </HStack>
                  </VStack>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <Flex h="40vh" justify={"center"} align="center">
                <VStack>
                  <Code>
                    You need an active session to create a link. Please login or
                    register
                  </Code>
                  <Button onClick={handleLogin}>
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                      alt="Microsoft Logo"
                      boxSize={"22px"}
                      maxBlockSize={"22px"}
                      maxInlineSize={"22px"}
                    />
                    <Text m="2%">Sign in or Register. (@tec.mx)</Text>
                  </Button>
                </VStack>
              </Flex>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </>
  );
};

export default EditForm;
