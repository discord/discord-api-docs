import Details from "@theme/MDXComponents/Details";

export default function Collapsible(props: { children: React.ReactNode; title?: string }) {
  const { children, title = "Collapse" } = props;

  return (
    <Details>
      <summary mdxType="summary">{title}</summary>
      {children}
    </Details>
  );
}

// interface Props {
//   title: string;
//   description: string;
//   icon: string;
//   children: React.ReactNode;
// }

// export default function Collapsible({ title, description, icon, children }: Props) {
//   return (
//     <details>
//       <summary>{title}</summary>
//       {children}
//     </details>
//   );
// }
