import {
  Container,
  VStack,
  Input,
  Button,
  HStack,
  Code,
  Avatar,
  Text,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { TopNavBar } from "../components/Layout/TopNavBar";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import client from "../client";
import { supabase } from "../supabase";
import { setCookie } from "cookies-next";

const Register = () => {
  const router = useRouter();
  const toast = useToast();
  const email = router.query.email;

  const handleRegister = async (values) => {
    const { username, email, picUrl } = values;
    if (!email) {
      toast({
        title: "Error.",
        description:
          "Please complete the login process with Microsoft Accounts.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

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
    const response = await client.post("/User/createValidUser", {
      username: username,
      email: email,
      picUrl: picUrl,
    });
    if (response.status === 200) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setCookie("RoboLinks", response.data.idUser);
      router.push("/");
    } else {
      toast({
        title: response.data.title,
        description: response.data.message,
        status: "error",
        isClosable: true,
      });
    }
  };

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
      <Formik
        initialValues={{ email: email, username: "", picUrl: "" }}
        onSubmit={handleRegister}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form>
            <VStack m="2%" justify={"center"}>
              <Heading mb="2%">Complete your profile</Heading>
              <VStack>
                <Code>email</Code>
                <Field name="email" type="email" as={Input} disabled required />
                <Code>username</Code>
                <Field name="username" type="text" as={Input} required />
              </VStack>
            </VStack>
            <VStack>
              <HStack>
                <Code>Profile Picture</Code>
                <Text fontSize="sm" m="2%">
                  (optional)
                </Text>
              </HStack>
              <VStack m="5%">
                <Avatar
                  src={
                    values?.picUrl ?? "" //if picUrl is null, then show a default image
                  }
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
              <Button type="submit">Register</Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Register;
