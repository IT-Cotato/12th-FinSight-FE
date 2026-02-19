import Image from 'next/image';

interface LoadingProps {
  message?: string;
  className?: string;
}

export default function Loading({ message, className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* 로딩 인디케이터 SVG */}
      <div className="flex items-center justify-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="20"
          viewBox="0 0 64 20"
          fill="none"
          className="loading-dots"
        >
          <circle cx="10" cy="10" r="6" fill="#9C95FA">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0s"
            />
            <animate
              attributeName="r"
              values="6;7;6"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>
          <circle cx="32" cy="10" r="6" fill="#9C95FA">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0.2s"
            />
            <animate
              attributeName="r"
              values="6;7;6"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0.2s"
            />
          </circle>
          <circle cx="54" cy="10" r="6" fill="#9C95FA">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0.4s"
            />
            <animate
              attributeName="r"
              values="6;7;6"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0.4s"
            />
          </circle>
        </svg>
      </div>

      {/* 캐릭터 이미지 */}
      <div className="relative animate-float aspect-[68/95]">
        <Image
          src="/img-character-main.png"
          alt="핀토 캐릭터"
          width={136}
          height={190}
          priority
        />
      </div>

      {/* 로딩 메시지 */}
      {message && (
        <p className="mt-6 text-primary-10 text-b1">
          {message}
        </p>
      )}
    </div>
  );
}
