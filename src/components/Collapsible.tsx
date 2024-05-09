import Details from "@theme/MDXComponents/Details";

export default function Collapsible(props: { children: React.ReactNode; title?: string }) {
  const { children, title = "Collapse" } = props;

  return (
    <details>
      <summary mdxType="summary">{title}</summary>
      {children}
    </details>
  );
}
