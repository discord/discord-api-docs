interface Props {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}

export default function Collapsible({ title, description, icon, children }: Props) {
  return (
    <details>
      <summary>{title}</summary>
      {children}
    </details>
  );
}
