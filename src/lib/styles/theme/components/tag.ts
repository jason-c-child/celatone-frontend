import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const honeydewDarker = definePartsStyle({
  container: {
    bg: "honeydew.darker",
    color: "text.main",
  },
});

const violetDark = definePartsStyle({
  container: {
    bg: "violet.dark",
    color: "pebble.900",
  },
});

const gray = definePartsStyle({
  container: {
    bg: "pebble.700",
    color: "text.main",
  },
});

export const Tag = defineMultiStyleConfig({
  baseStyle: {
    container: {
      px: 2,
      py: 0,
      borderRadius: "full",
      lineHeight: "100%",
      textAlign: "center",
    },
  },
  sizes: {
    sm: {
      container: {
        maxH: "20px",
        fontSize: "12px",
      },
    },
    md: {
      container: {
        maxH: "24px",
        fontSize: "12px",
      },
    },
  },
  variants: {
    "violet-dark": violetDark,
    "honeydew-darker": honeydewDarker,
    gray,
  },
  defaultProps: {
    size: "md",
    variant: "honeydew-darker",
  },
});
