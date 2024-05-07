interface Props {
  currentLocale: string;
}

export default function LocalPicker({ currentLocale }: Props) {
  return <div>LocalePicker: {currentLocale}</div>;
}
