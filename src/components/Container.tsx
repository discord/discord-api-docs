interface Props {
  children: React.ReactNode;
}

export default function Container({ children }: Props) {
  return <div>{children}</div>;
}
