import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import client from "../../utils/client";
import EditForm from "../Link/EditForm";

const SearchBar = ({ setSearch, setTags, search, idUser }) => {
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState(new Set() as Set<number>);
  const [isSelected, setIsSelected] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, error } = useQuery(["tags"], () =>
    client.get("/Tag/getTags")
  );
  const handleSearch = (Search = search, tags = Array.from(selectedTags)) => {
    queryClient.fetchQuery(["links"], () =>
      client.post("/Link/searchLinks", {
        search: Search,
        tags: tags,
      })
    );
  };

  const { mutate } = useMutation(
    (values) => {
      return client.post("/Link/createLink", values);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["links"]);
      },
    }
  );

  const handleCreate = (values) => {
    const m = mutate(values);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <EditForm onClose={onClose} onSubmit={handleCreate} idUser={idUser} />
      </Modal>
      <Box>
        <HStack>
          <IconButton
            aria-label="Add new Link"
            icon={<AddIcon />}
            onClick={onOpen}
          />
          <Input
            focusBorderColor="blue.500"
            placeholder="Search"
            onChange={async (e) => {
              await setSearch(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <Button onClick={() => handleSearch()}>Search</Button>
          <Menu>
            <MenuButton>
              <Button>
                <Badge colorScheme={"green"}>Tags</Badge>
              </Button>
            </MenuButton>
            <MenuList>
              {data?.data?.map((tag) => {
                return (
                  <MenuItem
                    key={tag.idTag}
                    onClick={() => {
                      setIsSelected({ ...isSelected, [tag.idTag]: true });
                      selectedTags.add(tag.idTag);
                      setSelectedTags(selectedTags);
                      setTags(Array.from(selectedTags));
                      handleSearch(search, Array.from(selectedTags));
                    }}
                  >
                    <HStack justify={"space-between"}>
                      <Badge colorScheme={tag.tagColor}>{tag.tagName}</Badge>
                      <Spacer />
                      {isSelected[tag.idTag] ? <CheckIcon /> : null}
                    </HStack>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <HStack>
            {Array.from(selectedTags).map((tag) => {
              const tagData = data?.data?.find((t) => t.idTag === tag);
              return (
                <Badge
                  key={tagData.idTag}
                  colorScheme={tagData.tagColor}
                  onClick={() => {
                    setIsSelected({ ...isSelected, [tagData.idTag]: false });
                    selectedTags.delete(tagData.idTag);
                    setSelectedTags(selectedTags);
                    setTags(Array.from(selectedTags));
                    handleSearch(search, Array.from(selectedTags));
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
      </Box>
    </>
  );
};

export default SearchBar;
