type Props = {
  index: number;
  text: string;
  selected: boolean;
  onSelect: () => void;
};

export default function QuizChoiceButton({
  index,
  text,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-2xl px-6 py-5 text-left",
        "border border-primary-90",
        selected ? "bg-primary-60 text-gray-10" : "bg-primary-100 text-gray-10",
      ].join(" ")}
    >
      <span className="text-b2">
        {index + 1}. {text}
      </span>
    </button>
  );
}
