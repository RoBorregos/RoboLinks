import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import client from "../../client";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { setCookie } from "cookies-next";

export const TopRight = () => {
  const router = useRouter();
  const idUser = getCookie("RoboLinks");
  const toast = useToast();
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
                pathname: "/userAuth/register",
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
  const { data, isLoading, isError } = useQuery(["user"], async () => {
    const { data } = await client.get("/User/getUser?idUser=" + idUser);
    return data;
  });
  return (
    <>
      <HStack>
        <Avatar src={data?.picUrl ?? ""} name={data?.username ?? ""} />
        <ColorModeSwitcher />
        <Menu>
          <MenuButton>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Menu"
              variant="ghost"
              color="white"
            />
          </MenuButton>
          {idUser ? (
            <MenuList>
              <MenuItem
                onClick={() => {
                  router.push("/user/" + idUser);
                }}
              >
                <Text>Profile</Text>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  deleteCookie("RoboLinks");
                  router.reload();
                }}
              >
                <Text>Sign Out</Text>
              </MenuItem>
            </MenuList>
          ) : (
            <MenuList>
              <MenuItem onClick={handleLogin}>
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                  alt="Microsoft Logo"
                  boxSize={"22px"}
                  maxBlockSize={"22px"}
                  maxInlineSize={"22px"}
                />
                <Text m="2%">Sign in or Register. (@tec.mx)</Text>
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      </HStack>
    </>
  );
};
