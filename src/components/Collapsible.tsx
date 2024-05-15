import * as React from "react";
import classNames from "classnames";
import Arrow from "./Arrow";

import styles from "./Collapsible.module.css";

interface CollapsibleProps {
  title: string;
  description?: string;
  icon?: string;
  open?: boolean;
  children: React.ReactNode;
}

export default function MDXCollapsible(props: CollapsibleProps) {
  const { title, description, icon, open = false, children } = props;
  const [isOpen, setIsOpen] = React.useState(open);
  const elementId = React.useId();
  return (
    <div className={styles.collapsible}>
      <div
        className={classNames(styles.head, { [styles.bottomBorderRadius]: !isOpen })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <header>
          <div className={styles.container}>
            <span className={styles.title}>{title}</span>
          </div>
          {description != null && description !== "" && <span className={styles.description}>{description}</span>}
        </header>

        <Arrow
          className={classNames(styles.trigger, styles.chevron, isOpen ? styles.chevronClose : styles.chevronOpen)}
          aria-controls={elementId}
          aria-expanded={isOpen}
        />
      </div>

      <aside
        className={classNames(styles.aside, styles.bottomBorderRadius, isOpen ? styles.open : "")}
        hidden={!isOpen}
        id={elementId}
        aria-hidden={!isOpen}
      >
        {children}
      </aside>
    </div>
  );
}
