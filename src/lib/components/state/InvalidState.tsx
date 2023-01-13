import { Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { MdSearchOff } from "react-icons/md";

interface InvalidStateProps {
  title: string;
}

export const InvalidState = ({ title }: InvalidStateProps) => (
  <Flex
    direction="column"
    alignItems="center"
    borderY="1px solid"
    borderColor="divider.main"
    width="full"
    my="24px"
    py="24px"
  >
    <Icon as={MdSearchOff} color="gray.600" boxSize="128" />
    <Heading as="h5" variant="h5" my="8px">
      {title}
    </Heading>
    <Text variant="body2" fontWeight="500" color="gray.500" textAlign="center">
      Please double-check your input and make sure you have selected the correct
      network.
    </Text>
  </Flex>
);