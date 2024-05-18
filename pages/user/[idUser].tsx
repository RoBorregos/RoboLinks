import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCookie, hasCookie } from "cookies-next";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import * as Yup from "yup";
import client from "../../client";
import { TopNavBar } from "../../components/Layout/TopNavBar";
import { LinkComponent } from "../../components/Link/LinkComponent";
import { supabase } from "../../supabase";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
});

const UserPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { idUser } = router.query;
  const { data, isLoading, isError } = useQuery(["user", idUser], () =>
    client.get(`/User/getUser?idUser=${idUser}`)
  );
  const [isEditing, setIsEditing] = useState(false);

  const links = useQuery(["links", idUser], () =>
    client.get(`/Link/getLinksByUser?idUser=${idUser}`)
  );

  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr?.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  const chunkedData = chunk(links?.data?.data, isMobile ? 1 : 3);
  const isUser = hasCookie("RoboLinks") && getCookie("RoboLinks") === idUser;
  return (
    <>
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
      {isEditing ? (
        <Center mt="5%">
          <Formik
            initialValues={{
              username: data?.data?.username,
              email: data?.data?.email,
              password: data?.data?.password,
              picUrl: data?.data?.picUrl,
            }}
            onSubmit={async (values) => {
              if (values.picUrl.substring(0, 4) == "data") {
                const reader = new FileReader();
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
              const response = await client.post("/User/validUserUpdate", {
                idUser: idUser,
                username: values.username,
                email: values.email,
                password: values.password,
                picUrl: values.picUrl,
              });
              if (response?.status === 200) {
                toast({
                  title: "User updated.",
                  description: "We've updated your user for you.",
                  status: "success",
                  isClosable: true,
                });
                setIsEditing(false);
              } else {
                toast({
                  title: "Username or email already taken.",
                  description: "Unable to update user.",
                  status: "error",
                  isClosable: true,
                });
              }
            }}
            validationSchema={validationSchema}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <HStack maxW="60%">
                  <VStack>
                    <Avatar
                      size="2xl"
                      name={values.username}
                      src={values.picUrl}
                    />
                    <FormLabel htmlFor="picUrl">Picture URL</FormLabel>
                    <Field name="picUrl" as={Input} />
                    <FormLabel htmlFor="picUrl">Upload Picture</FormLabel>
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files) return;
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = async () => {
                          setFieldValue("picUrl", reader.result);
                        };
                      }}
                    />
                  </VStack>
                  <VStack minW="100%">
                    <FormControl
                      isInvalid={
                        Boolean(errors.username) && Boolean(touched.username)
                      }
                    >
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <Field name="username" as={Input} />
                      <FormHelperText>
                        {errors.username &&
                          touched.username &&
                          errors.username.toString()}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        Boolean(errors.email) && Boolean(touched.email)
                      }
                    >
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Field name="email" as={Input} />
                      <FormHelperText>
                        {errors.email &&
                          touched.email &&
                          errors.email.toString()}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        Boolean(errors.password) && Boolean(touched.password)
                      }
                    >
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Field name="password" as={Input} />
                      <FormHelperText>
                        {errors.password &&
                          touched.password &&
                          errors.password.toString()}
                      </FormHelperText>
                    </FormControl>
                  </VStack>
                </HStack>
                <HStack w="120%" justify={"space-between"} mt="5%">
                  <Button
                    type="submit"
                    w="60%"
                    colorScheme={"teal"}
                    variant="outline"
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    w="60%"
                    colorScheme={"red"}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </HStack>
              </Form>
            )}
          </Formik>
        </Center>
      ) : (
        <>
          <VStack mt="5%">
            <HStack>
              <Avatar
                size="2xl"
                name={data?.data?.username}
                src={data?.data?.picUrl}
              />
              <VStack>
                <Text fontSize="4xl">{data?.data?.username}</Text>
                <Text fontSize="2xl">{data?.data?.email}</Text>
              </VStack>
              {isUser && (
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                />
              )}
            </HStack>
          </VStack>
        </>
      )}
      <>
        <VStack mt="5%" me="5%">
          {links.isLoading ? (
            <Spinner />
          ) : links.isError ? (
            <Text>Error</Text>
          ) : (
            <>
              {chunkedData.map((chunk, index) => (
                <HStack key={index} justify={"left"} w="90%" spacing={16}>
                  {chunk.map((link) => (
                    <LinkComponent
                      key={link.idLink}
                      idLink={link.idLink}
                      idUser={isUser ?? null}
                    />
                  ))}
                </HStack>
              ))}
            </>
          )}
        </VStack>
        <Container
          minW="100%"
          padding={"0.5rem"}
          background={"gray.700"}
          backdropBlur={"sm"}
          opacity={0}
        ></Container>
      </>
    </>
  );
};

export default UserPage;
