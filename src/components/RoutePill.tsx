import styles from "./RoutePill.module.css";

interface Props {
  method: string;
  children: string;
}

export default function RoutePill({ method, children }: Props) {
  let methodClass = `${styles.method}`;
  switch (method) {
    case "GET":
      methodClass += ` ${styles.method_get}`;
      break;
    case "POST":
      methodClass += ` ${styles.method_post}`;
      break;
    case "PUT":
      methodClass += ` ${styles.method_put}`;
      break;
    case "DELETE":
      methodClass += ` ${styles.method_delete}`;
      break;
    case "PATCH":
      methodClass += ` ${styles.method_patch}`;
      break;
    case "HEAD":
      methodClass += ` ${styles.method_head}`;
      break;
    case "OPTIONS":
      methodClass += ` ${styles.method_options}`;
      break;
  }
  return (
    <div className={styles.pill}>
      <div className={methodClass}>{method}</div>
      <div className={styles.route}>{children}</div>
    </div>
  );
}
