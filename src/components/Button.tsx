interface Props {
  href: string;
  color?: string;
  children: React.ReactNode;
}

export default function Button({ href, color, children }: Props) {
  return <a href={href}>{children}</a>;
}
