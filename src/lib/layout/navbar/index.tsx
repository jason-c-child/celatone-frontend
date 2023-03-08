import { Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  MdHome,
  MdCode,
  MdMoreHoriz,
  MdOutlineAdd,
  MdSearch,
  MdInput,
  MdOutlineHistory,
  MdPublic,
  MdReadMore,
} from "react-icons/md";

import { INSTANTIATED_LIST_NAME, getListIcon, SAVED_LIST_NAME } from "lib/data";
import { useContractStore, usePublicProjectStore } from "lib/providers/store";
import { cmpContractListInfo } from "lib/stores/contract";
import { formatSlugName } from "lib/utils";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import type { MenuInfo } from "./type";

interface NavbarProps {
  isExpand: boolean;
  setIsExpand: (value: boolean) => void;
}

const Navbar = observer(({ isExpand, setIsExpand }: NavbarProps) => {
  const { getContractLists } = useContractStore();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const { currentChainRecord } = useWallet();

  const router = useRouter();
  const { network } = router.query;
  const pathName = router.asPath;

  const isCurrentPage = useCallback(
    (slug: string) => {
      if (network) {
        return slug === "/"
          ? pathName === `/${network}`
          : pathName === `/${network}${slug}`;
      }
      return pathName === `${slug}`;
    },
    [network, pathName]
  );

  const navMenu: MenuInfo[] = [
    {
      category: "Overview",
      submenu: [
        { name: "Overview", slug: "/", icon: MdHome },
        {
          name: "Past Transactions",
          slug: "/past-txs",
          icon: MdOutlineHistory,
        },
      ],
    },
    {
      category: "Quick Actions",
      submenu: [
        {
          name: "Deploy Contract",
          slug: "/deploy",
          icon: MdOutlineAdd,
        },
        {
          name: "Query",
          slug: "/query",
          icon: MdSearch,
        },
        {
          name: "Execute",
          slug: "/execute",
          icon: MdInput,
        },
        {
          name: "Migrate",
          slug: "/migrate",
          icon: MdReadMore,
        },
      ],
    },
    {
      category: "Codes",
      submenu: [
        { name: "My Codes", slug: "/codes", icon: MdCode },
        { name: "Recent Codes", slug: "/recent-codes", icon: MdPublic },
      ],
    },
    {
      category: "Contracts",
      submenu: [
        {
          name: INSTANTIATED_LIST_NAME,
          slug: `/contract-list/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
          icon: getListIcon(INSTANTIATED_LIST_NAME),
        },
        {
          name: SAVED_LIST_NAME,
          slug: `/contract-list/${formatSlugName(SAVED_LIST_NAME)}`,
          icon: getListIcon(SAVED_LIST_NAME),
        },
        ...getContractLists()
          .filter((list) => list.slug !== formatSlugName(SAVED_LIST_NAME))
          .sort(cmpContractListInfo)
          .slice(0, 3)
          .map((list) => ({
            name: list.name,
            slug: `/contract-list/${list.slug}`,
            icon: getListIcon(list.name),
          })),
        {
          name: "View All Lists",
          slug: "/contract-list",
          icon: MdMoreHoriz,
        },
      ],
    },
  ];

  if (currentChainRecord?.chain.network_type === "mainnet") {
    navMenu.push({
      category: "Public Projects",
      submenu: [
        ...getSavedPublicProjects().map((list) => ({
          name: list.name,
          slug: `/public-project/${list.slug}`,
          logo: list.logo,
        })),
        {
          name: "View All Projects",
          slug: "/public-project",
          icon: MdMoreHoriz,
        },
      ],
    });
  }

  return (
    <Flex direction="column" h="full" overflow="hidden" position="relative">
      {isExpand ? (
        <ExpandNavMenu
          navMenu={navMenu}
          isCurrentPage={isCurrentPage}
          setIsExpand={setIsExpand}
        />
      ) : (
        <CollapseNavMenu
          navMenu={navMenu}
          isCurrentPage={isCurrentPage}
          setIsExpand={setIsExpand}
        />
      )}
    </Flex>
  );
});

export default Navbar;