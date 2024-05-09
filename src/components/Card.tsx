import React from "react";
import styles from "./Card.module.css";
import { useColorMode } from "@docusaurus/theme-common";

interface Props {
  title: string;
  link: string;
  children: React.ReactNode;
}

export default function Card({ title, link, children }: Props) {
  const { colorMode } = useColorMode();
  const themeStyle = colorMode === "dark" ? styles.dark : styles.light;
  const style = `${styles.card} ${themeStyle}`;
  return (
    <a href={link} className={style}>
      <div className={styles.title}>{title}</div>
      <div>{children}</div>
    </a>
  );
}
