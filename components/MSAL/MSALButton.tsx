import { useMsal } from "@azure/msal-react";
import {
  Button,
  HStack,
  Text,
  Image,
  Code,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { loginRequest } from "../../authConfig";
import client from "../../client";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

const MSALButton = () => {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      await instance.initialize();
      const loginResponse = await instance.loginRedirect(loginRequest);
      //   if (loginResponse?.account?.username) {
      //     instance.setActiveAccount(loginResponse.account);
      //     const user = await client.post("/User/getUserByEmail", {
      //       email: loginResponse.account.username,
      //     });
      //     if (user.status === 200) {
      //       if (user.data) {
      //         setCookie("RoboLinks", user.data.idUser);
      //         router.reload();
      //       } else {
      //         router.push(
      //           {
      //             pathname: "/userAuth/register",
      //             query: { email: loginResponse.account.username },
      //           },
      //           "/userAuth/register"
      //         );
      //       }
      //     } else {
      //       toast({
      //         title: "Error.",
      //         description: "Something went wrong.",
      //         status: "error",
      //         duration: 9000,
      //         isClosable: true,
      //       });
      //       //sessionStorage.removeItem("msal.interaction.status");
      //     }
      //   }
    } catch (e) {
      console.error(e);
      //sessionStorage.removeItem("msal.interaction.status");
    }
  };

  return (
    <VStack>
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
  );
};
export default MSALButton;
