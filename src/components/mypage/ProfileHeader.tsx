import Image from "next/image";
import type { CategoryItem, MyProfile } from "@/types/mypage";

type Props = {
  profile: MyProfile;
  categories: CategoryItem[];
  onEditProfile: () => void;
};

export default function ProfileHeader({
  profile,
  categories,
  onEditProfile,
}: Props) {
  return (
    <section className="pt-8">
      <div className="px-5">
        <button
          type="button"
          onClick={onEditProfile}
          className="ml-auto flex items-center gap-1 text-b4 text-bg-20"
        >
          프로필 수정
          <Image
            src="/mypage/icon-pencil.svg"
            alt="edit"
            width={17}
            height={17}
          />
        </button>
      </div>

      <div className="mt-2 flex flex-col items-center">
        <Image
          src="/mypage/character.svg"
          alt="character"
          width={300}
          height={80}
          priority
        />
        <h2 className="text-h2 font-semibold text-gray-10">
          {profile.nickname}
        </h2>

        <div className="mt-4 flex flex-wrap justify-center gap-2 px-6">
          {categories.map((c) => (
            <span
              key={c.section}
              className="rounded-full bg-primary-70 px-3 py-2 text-b5 text-bg-10"
            >
              #{c.displayName}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
