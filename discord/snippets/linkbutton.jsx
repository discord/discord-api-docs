export const LinkButton = ({ children, to, color }) => {
  return (
    <a href={to} className={"MDXLinkButton "+color}>
      <span>{children}</span>
    </a>
  );
};