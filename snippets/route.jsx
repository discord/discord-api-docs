export const Route = ({ method, children }) => {
  return (
    <div className="MDXRoute">
      <span className={"verb" + " " + method.toLowerCase()}>{method}</span>
      <span className="url">{children}</span>
    </div>
  );
};