"use client";

import { useEffect, useState } from "react";

type Props = {
  show: boolean;
  bonusText: string;
};

export default function BonusToast({ show, bonusText }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1400); // 잠시 떴다 사라짐
    return () => clearTimeout(t);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-16 z-50 -translate-x-1/2">
      <div
        className="
          rounded-full border border-primary-90 bg-primary-100
          px-6 py-3 text-b3-h5 font-semibold text-gray-10
          shadow-[0_12px_30px_rgba(0,0,0,0.35)]
          backdrop-blur
        "
      >
        {bonusText}
      </div>
    </div>
  );
}
