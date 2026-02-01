"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
};

export default function PageHeader({ title }: Props) {
  const router = useRouter();

  return (
    <header className="relative flex items-center justify-center pt-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-0"
        aria-label="back"
      >
        <Image src="/quiz/icon-back.svg" alt="back" width={9} height={9} />
      </button>

      <h1 className="text-b2 text-bg-20">{title}</h1>
    </header>
  );
}
