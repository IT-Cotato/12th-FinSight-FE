"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
};

export default function PasswordInput({ placeholder, value, onChange }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[60px] w-full rounded-md bg-bg-70 px-5 text-b1 text-gray-10 placeholder:text-gray-50 outline-none"
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
        aria-label="toggle password visible"
      >
        <Image
          src={visible ? "/mypage/icon-eye-on.svg" : "/mypage/icon-eye-off.svg"}
          alt="eye"
          width={22}
          height={22}
        />
      </button>
    </div>
  );
}
