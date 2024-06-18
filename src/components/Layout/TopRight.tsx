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
import { useRouter } from "next/router";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { signOut, useSession } from "next-auth/react";

export const TopRight = () => {
  const router = useRouter();
  const session = useSession();
  
  return (
    <>
      <HStack>
        <Avatar src={session.data?.user?.image ?? ""} name={session.data?.user?.name ?? ""} />
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
          {session.data && false? (
            <MenuList>
              <MenuItem
                onClick={() => {
                  router.push("/user/" + session.data.user.id);
                }}
              >
                <Text>Profile</Text>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  void signOut()
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
