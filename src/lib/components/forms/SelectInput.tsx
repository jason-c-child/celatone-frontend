import {
  Icon,
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
import { useEffect, useRef, useState, useMemo } from "react";
import type { IconType } from "react-icons/lib";
import { MdArrowDropDown } from "react-icons/md";

import type { Option } from "lib/types";

const ITEM_HEIGHT = 56;

interface SelectInputProps<T extends string> {
  formLabel?: string;
  options: {
    label: string;
    value: T;
    disabled: boolean;
    icon?: IconType;
    iconColor?: string;
  }[];
  onChange: (newVal: T) => void;
  placeholder?: string;
  initialSelected: string;
  hasDivider?: boolean;
  helperTextComponent?: JSX.Element;
}

interface SelectItemProps {
  children: NonNullable<ReactNode>;
  onSelect?: () => void;
  disabled: boolean;
}

const SelectItem = ({ children, onSelect, disabled }: SelectItemProps) => {
  return (
    <Flex
      px={4}
      py={2}
      onClick={onSelect}
      color="text.main"
      cursor="pointer"
      gap={2}
      aria-disabled={disabled}
      _hover={{ bg: "pebble.800" }}
      transition="all .25s ease-in-out"
      _disabled={{ opacity: 0.4, pointerEvents: "none" }}
    >
      {children}
    </Flex>
  );
};

export const SelectInput = <T extends string>({
  formLabel,
  options,
  onChange,
  placeholder = "",
  initialSelected,
  hasDivider = false,
  helperTextComponent,
}: SelectInputProps<T>) => {
  const optionRef = useRef() as MutableRefObject<HTMLElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const initialSelectedValue = useMemo(
    () => options.find((item) => item.value === initialSelected)?.label ?? "",
    [initialSelected, options]
  );
  const [selected, setSelected] = useState(initialSelectedValue);
  const [inputRefWidth, setInputRefWidth] = useState<Option<number>>();
  useOutsideClick({
    ref: optionRef,
    handler: () => isOpen && onClose(),
  });
  const selectedOption = options.find((item) => item.label === selected);

  useEffect(() => {
    if (inputRef.current) {
      setInputRefWidth(inputRef.current.clientWidth);
    }
  }, [inputRef]);

  useEffect(() => {
    setSelected(initialSelectedValue);
  }, [initialSelectedValue]);

  return (
    <Popover placement="bottom-start" isOpen={isOpen}>
      <PopoverTrigger>
        <InputGroup
          onClick={onOpen}
          sx={{
            "&[aria-expanded=true]": {
              "> input": {
                border: "2px solid",
                borderColor: "lilac.main",
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
              bg: "background.main",
              top: -2,
            },
          }}
        >
          <div className="form-label">{formLabel}</div>
          {selectedOption?.icon && (
            <InputLeftElement pointerEvents="none" h="full">
              <Icon
                as={selectedOption.icon}
                color={selectedOption.iconColor}
                fontSize="20px"
              />
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
            <Icon as={MdArrowDropDown} color="pebble.600" fontSize="24px" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        ref={optionRef}
        border="unset"
        bg="pebble.900"
        w={inputRefWidth}
        maxH={`${ITEM_HEIGHT * 4}px`}
        overflow="scroll"
        borderRadius="8px"
        _focusVisible={{
          outline: "none",
        }}
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: hasDivider && "1px solid",
            borderBottomColor: hasDivider && "pebble.700",
          },
        }}
      >
        {options.map(({ label, value, disabled, icon, iconColor }) => (
          <SelectItem
            key={value}
            onSelect={() => {
              setSelected(label);
              onChange(value);
              onClose();
            }}
            disabled={disabled}
          >
            {icon && <Icon as={icon} boxSize={5} color={iconColor} />}
            {label}
          </SelectItem>
        ))}
        <Flex
          px={4}
          h={`${ITEM_HEIGHT}px`}
          align="center"
          borderTop={!hasDivider ? "1px solid" : "none"}
          borderTopColor={!hasDivider ? "pebble.700" : "none"}
        >
          {helperTextComponent}
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
