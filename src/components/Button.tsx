import styles from "./Button.module.css";

interface Props {
  href: string;
  color?: string;
  children: React.ReactNode;
}

export default function Button({ href, color, children }: Props) {
  return (
    <a href={href} className={styles.button}>
      {children}
    </a>
  );
}
