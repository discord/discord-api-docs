interface Props {
  title: string;
  link: string;
}

export default function Card({ title, link }: Props) {
  return <div>{title}</div>;
}
