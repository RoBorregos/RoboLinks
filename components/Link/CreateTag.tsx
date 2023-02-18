import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import client from "../../client";

const colorSchemeArray = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
];

const CreateTag = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("gray");
  const { mutate } = useMutation(
    async () => {
      if (!tagName) return;
      return client.post("/Tag/createTag", {
        tagName: tagName,
        tagColor: tagColor,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tags"]);
      },
    }
  );
  const handleSubmit = () => {
    mutate();
    onClose();
  };
  return (
    <>
      <HStack>
        <Input
          type="createTagInputText"
          placeholder="Tag Name"
          onChange={(e) => {
            setTagName(e.target.value);
          }}
        />
        <Menu>
          <MenuButton type="button">
            <Badge colorScheme={tagColor}>{tagColor}</Badge>
          </MenuButton>
          <MenuList>
            {colorSchemeArray.map((color) => (
              <MenuItem
                key={color}
                onClick={() => {
                  setTagColor(color);
                }}
              >
                <Badge colorScheme={color}>{color}</Badge>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <IconButton
          aria-label="Create Tag"
          icon={<AddIcon />}
          onClick={handleSubmit}
        />
      </HStack>
    </>
  );
};

export default CreateTag;
