type Props = {
  qNo: number;
  question: string;
};

export default function QuizQuestionCard({ qNo, question }: Props) {
  return (
    <section
      className="
        rounded-xl
        border border-primary-90
        bg-primary-100
        px-6 py-6
      "
    >
      <p className="text-b1 text-primary-30">Q{qNo}.</p>

      <p className="mt-2 text-b1 text-gray-10">{question}</p>
    </section>
  );
}
