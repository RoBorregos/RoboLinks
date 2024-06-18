import { signOut, signIn, useSession } from "next-auth/react";

import {
  Avatar,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { setCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import * as Yup from "yup";
import client from "rbrgs/utils/client";
import { TopNavBar } from "rbrgs/components/Layout/TopNavBar";
import { supabase } from "../utils/supabase";

const LogInValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required("Username or email is required"),
  password: Yup.string().required("Password is required"),
});

const RegisterValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  //emails ending with @tec.mx are valid
  email: Yup.string()
    .email("Invalid email")
    .matches(/@tec\.mx$/, "Invalid domain")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const isEmail = (email: string) => {
  //emails ending with @tec.mx are valid
  const re = /^[\w-\.]+@tec\.mx$/;
  return re.test(email);
};

const LogIn = () => {
  const toast = useToast();
  const router = useRouter();
  const handleCreateAccount = async (values) => {
    const { username, email, password, picUrl } = values;
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
    const response = await client.post("/User/createValidUser", {
      username: username,
      email: email,
      password: password,
      picUrl: picUrl,
    });
    if (response.status === 200) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
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
  const handleLogIn = async (values) => {
    if (isEmail(values.usernameOrEmail)) {
      const response = await client.post("/User/validateLogInEmail", {
        email: values.usernameOrEmail,
        password: values.password,
      });
      if (response.data.length == 1) {
        setCookie("RoboLinks", response.data[0].idUser, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
        router.push("/");
      } else {
        toast({
          title: "Invalid credentials.",
          description: "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      const response = await client.post("/User/validateLogInUsername", {
        username: values.usernameOrEmail,
        password: values.password,
      });
      if (response.data.length == 1) {
        setCookie("RoboLinks", response.data[0].idUser, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
        router.push("/");
      } else {
        toast({
          title: "Invalid credentials.",
          description: "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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
      <Flex align={"center"} justify={"center"} m="5%">
        <HStack justify={"space-between"} spacing={6} w="80%">
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            validationSchema={LogInValidationSchema}
            onSubmit={handleLogIn}
          >
            {({ errors, touched }) => (
              <Form>
                <button
                onClick={() => void signIn()}
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 duration-100 hover:bg-slate-600 hover:text-white"
              >
                Sign in
              </button>
                <Text fontSize="4xl" align={"center"}>
                  Log In
                </Text>
                <FormControl
                  isInvalid={
                    Boolean(errors.usernameOrEmail) &&
                    Boolean(touched.usernameOrEmail)
                  }
                >
                  <FormLabel>Username or email.</FormLabel>
                  <Field
                    name="usernameOrEmail"
                    as={Input}
                    placeholder="Username or email"
                    m="5%"
                  />
                  <FormErrorMessage>
                    <ErrorMessage name="usernameOrEmail" />
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    Boolean(errors.password) && Boolean(touched.password)
                  }
                >
                  <FormLabel>Password</FormLabel>
                  <Field
                    name="password"
                    type="password"
                    as={Input}
                    placeholder="Password"
                    m="5%"
                  />

                  <FormErrorMessage>
                    <ErrorMessage name="password" />
                  </FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  m="5%"
                  w="100%"
                  variant={"outline"}
                >
                  Log In
                </Button>
              </Form>
            )}
          </Formik>
          <Text fontSize="4xl" align={"center"}>
            Or
          </Text>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              picUrl: "",
            }}
            validationSchema={RegisterValidationSchema}
            onSubmit={handleCreateAccount}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <HStack spacing={8}>
                  <VStack>
                    <Text fontSize="4xl">Register</Text>
                    <FormControl
                      isInvalid={
                        Boolean(errors.username) && Boolean(touched.username)
                      }
                    >
                      <FormLabel>Username</FormLabel>
                      <Field
                        name="username"
                        as={Input}
                        placeholder="Username"
                        m="5%"
                      />
                      <FormErrorMessage>
                        <ErrorMessage name="username" />
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        Boolean(errors.email) && Boolean(touched.email)
                      }
                    >
                      <FormLabel>Email</FormLabel>
                      <Field
                        name="email"
                        as={Input}
                        placeholder="Email"
                        m="5%"
                      />
                      <FormErrorMessage>
                        <ErrorMessage name="email" />
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        Boolean(errors.password) && Boolean(touched.password)
                      }
                    >
                      <FormLabel>Password</FormLabel>
                      <Field
                        name="password"
                        type="password"
                        as={Input}
                        placeholder="Password"
                        m="5%"
                      />
                      <FormErrorMessage>
                        <ErrorMessage name="password" />
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="teal"
                      m="5%"
                      w="100%"
                      variant={"outline"}
                    >
                      Create Account
                    </Button>
                  </VStack>
                  <FormControl>
                    <HStack>
                      <FormLabel>Profile Picture</FormLabel>
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
                  </FormControl>
                </HStack>
              </Form>
            )}
          </Formik>
        </HStack>
      </Flex>
    </>
  );
};

export default LogIn;
