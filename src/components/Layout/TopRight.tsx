import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import client from "../../utils/client";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

export const TopRight = () => {
  const router = useRouter();
  const idUser = getCookie("RoboLinks");

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
                  router.push("/login");
                }}
              >
                <Text>Sign Out</Text>
              </MenuItem>
            </MenuList>
          ) : (
            <MenuList>
              <MenuItem
                onClick={() => {
                  router.push("/login");
                }}
              >
                <Text>Log In</Text>
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      </HStack>
    </>
  );
};
