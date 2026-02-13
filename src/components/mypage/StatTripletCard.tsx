type Props = {
  attendanceDays: number;
  totalNewsSaved: number;
  totalQuizSolved: number;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-b3 text-gray-20">{label}</span>
      <span className="text-h5 font-semibold text-gray-20">{value}</span>
    </div>
  );
}

export default function StatTripletCard({
  attendanceDays,
  totalNewsSaved,
  totalQuizSolved,
}: Props) {
  return (
    <section className="mt-6 px-5">
      <div className="h-[90px] rounded-xl border border-primary-90 bg-primary-100 px-6">
        <div className="grid h-full grid-cols-5 items-center">
          <Stat label="저장한 뉴스" value={`${attendanceDays}일`} />
          <div className="mx-auto h-10 w-px bg-primary-90" />
          <Stat label="뉴스 저장" value={`${totalNewsSaved}개`} />
          <div className="mx-auto h-10 w-px bg-primary-90" />
          <Stat label="퀴즈 풀이" value={`${totalQuizSolved}회`} />
        </div>
      </div>
    </section>
  );
}
