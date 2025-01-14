import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  Heading,
} from "@chakra-ui/react";

import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";

interface FailedModalProps {
  errorLog: string;
  onClose: () => void;
}

export const FailedModal = ({ errorLog, onClose }: FailedModalProps) => (
  <Modal isOpen onClose={onClose} size="4xl" isCentered>
    <ModalOverlay />
    <ModalContent w="600px">
      <ModalHeader>
        <Flex gap={3} align="center">
          <CustomIcon
            name="alert-circle-solid"
            color="error.light"
            boxSize={5}
          />
          <Heading as="h5" variant="h5">
            Failed to instantiate
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        Something went wrong. Here are the error logs.
        <Box bg="background.main" borderRadius="8px" p={2} mt={4}>
          <Text>{errorLog}</Text>
        </Box>
      </ModalBody>

      <ModalFooter gap={2}>
        <CopyButton
          value={errorLog}
          size="md"
          amptrackSection="tx_modal_fail_rawlog"
        />
        <Button variant="outline-primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
