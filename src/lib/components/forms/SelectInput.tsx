import {
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  useOutsideClick,
  Flex,
  InputLeftElement,
} from "@chakra-ui/react";
import type { MutableRefObject, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";

const ITEM_HEIGHT = 56;

interface SelectInputProps<T extends string> {
  formLabel?: string;
  options: {
    label: string;
    value: T;
    disabled: boolean;
    icon?: IconKeys;
  }[];
  onChange: (newVal: T) => void;
  placeholder?: string;
  initialSelected: string;
  hasDivider?: boolean;
  helperTextComponent?: ReactNode;
  labelBgColor?: string;
}

interface SelectItemProps {
  children: NonNullable<ReactNode>;
  onSelect?: () => void;
  disabled: boolean;
}

const SelectItem = ({ children, onSelect, disabled }: SelectItemProps) => (
  <Flex
    px={4}
    py={2}
    onClick={onSelect}
    color="text.main"
    cursor="pointer"
    gap={2}
    aria-disabled={disabled}
    _hover={{ bg: "gray.800" }}
    transition="all .25s ease-in-out"
    _disabled={{ opacity: 0.4, pointerEvents: "none" }}
  >
    {children}
  </Flex>
);

export const SelectInput = <T extends string>({
  formLabel,
  options,
  onChange,
  placeholder = "",
  initialSelected,
  hasDivider = false,
  helperTextComponent,
  labelBgColor = "background.main",
}: SelectInputProps<T>) => {
  const optionRef = useRef() as MutableRefObject<HTMLElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selected, setSelected] = useState(
    () => options.find((item) => item.value === initialSelected)?.label ?? ""
  );
  useOutsideClick({
    ref: optionRef,
    handler: () => isOpen && onClose(),
  });
  const selectedOption = options.find((item) => item.label === selected);

  useEffect(() => {
    if (options.every((option) => !option.disabled)) {
      setSelected(
        () =>
          options.find((item) => item.value === initialSelected)?.label ?? ""
      );
    }
  }, [initialSelected, options]);

  return (
    <Popover placement="bottom-start" isOpen={isOpen}>
      <PopoverTrigger>
        <InputGroup
          onClick={onOpen}
          sx={{
            "&[aria-expanded=true]": {
              "> input": {
                border: "2px solid",
                borderColor: "secondary.main",
              },
            },
            "& .form-label": {
              fontSize: "12px",
              color: "text.dark",
              letterSpacing: "0.15px",
              position: "absolute",
              ml: 3,
              px: 1,
              zIndex: 2,
              bg: labelBgColor,
              top: -2,
            },
          }}
        >
          <div className="form-label">{formLabel}</div>
          {selectedOption?.icon && (
            <InputLeftElement pointerEvents="none" h="full" ml={1}>
              <CustomIcon name={selectedOption.icon} color="gray.600" />
            </InputLeftElement>
          )}
          <Input
            ref={inputRef}
            size="lg"
            textAlign="start"
            type="button"
            value={selected || placeholder}
            fontSize="14px"
            color={selected ? "text.main" : "text.dark"}
            pl={selectedOption?.icon ? 9 : 4}
          />
          <InputRightElement pointerEvents="none" h="full">
            <CustomIcon name="chevron-down" color="gray.600" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        ref={optionRef}
        border="unset"
        bg="gray.900"
        w={inputRef.current?.clientWidth}
        maxH={`${ITEM_HEIGHT * 4}px`}
        overflow="scroll"
        borderRadius="8px"
        _focusVisible={{
          outline: "none",
        }}
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: hasDivider && "1px solid",
            borderBottomColor: hasDivider && "gray.700",
          },
        }}
      >
        {options.map(({ label, value, disabled, icon }) => (
          <SelectItem
            key={value}
            onSelect={() => {
              setSelected(label);
              onChange(value);
              onClose();
            }}
            disabled={disabled}
          >
            {icon && <CustomIcon name={icon} color="gray.600" />}
            {label}
          </SelectItem>
        ))}
        {helperTextComponent && (
          <Flex
            px={4}
            h={`${ITEM_HEIGHT}px`}
            align="center"
            borderTop={!hasDivider ? "1px solid" : "none"}
            borderTopColor="gray.700"
          >
            {helperTextComponent}
          </Flex>
        )}
      </PopoverContent>
    </Popover>
  );
};
