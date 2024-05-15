import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import LocaleDropdownNavbarItem from "@theme-original/NavbarItem/LocaleDropdownNavbarItem";
import type LocaleDropdownNavbarItemType from "@theme/NavbarItem/LocaleDropdownNavbarItem";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof LocaleDropdownNavbarItemType>;

export default function LocaleDropdownNavbarItemWrapper(props: Props): JSX.Element {
  return (
    <BrowserOnly>
      {() => {
        const showPicker = window.location.pathname.includes("quick-start/getting-started");
        return showPicker ? <LocaleDropdownNavbarItem {...props} /> : <></>;
      }}
    </BrowserOnly>
  );
}
