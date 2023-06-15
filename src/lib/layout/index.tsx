import { Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { useMobile } from "lib/app-provider";
import { scrollToTop } from "lib/utils";

import Footer from "./Footer";
import Header from "./Header";
import MobileHeader from "./mobile/MobileHeader";
import Navbar from "./navbar";
import SubHeader from "./SubHeader";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const [isExpand, setIsExpand] = useState(false);
  const isMobile = useMobile();

  const mobile = {
    templateAreas: `"header""main"`,
    templateRows: "60px 1fr",
    templateCols: "1fr",
    header: <MobileHeader />,
    subHeader: undefined,
  };
  const fullMode = {
    templateAreas: `"header header""subheader subheader""nav main"`,
    templateRows: "70px 48px 1fr",
    templateCols: isExpand ? "224px 1fr" : "48px 1fr",
    header: <Header />,
    subHeader: <SubHeader />,
  };

  const mode = (() => {
    return isMobile ? mobile : fullMode;
  })();

  useEffect(() => {
    scrollToTop();
  }, [router.asPath]);

  return (
    <Grid
      templateAreas={mode.templateAreas}
      gridTemplateRows={mode.templateRows}
      gridTemplateColumns={mode.templateCols}
      h="100vh"
      overflowX="hidden"
      overflowY="scroll"
      bg="background.main"
    >
      <GridItem bg="gray.900" area="header" mb={1}>
        {mode.header}
      </GridItem>
      {!isMobile && (
        <>
          <GridItem
            bg={{ base: "background.main", md: "gray.900" }}
            area="subheader"
            mb="1"
            overflowY={isMobile ? "visible" : "auto"}
            py={{ base: 2, md: 0 }}
            px={{ base: 4, md: 0 }}
          >
            {mode.subHeader}
          </GridItem>
          <GridItem bg={{ base: "background.main", md: "gray.900" }} area="nav">
            <Navbar isExpand={isExpand} setIsExpand={setIsExpand} />
          </GridItem>
        </>
      )}
      <GridItem area="main" overflowX="hidden" id="content">
        <div style={{ minHeight: `calc(100vh - 129px)` }}>{children}</div>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
