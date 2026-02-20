'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { kakaoLogin } from '@/api/auth';
import Loading from '@/components/common/Loading';
function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 code 추출
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        // 에러가 있으면 처리
        if (error) {
          alert('카카오 로그인에 실패했습니다.');
          router.push('/');
          return;
        }

        // code가 없으면 에러
        if (!code) {
          alert('카카오 인증 코드를 받지 못했습니다.');
          router.push('/');
          return;
        }

        // 카카오 로그인 API 호출
        const response = await kakaoLogin({ code });

        // 신규 가입자면 회원가입으로, 기존 사용자면 홈으로
        if (response.data?.isNewUser) {
          // 신규 가입자 - 회원가입 페이지로 kakaoId 전달
          router.push(`/signup?kakaoId=${response.data.kakaoId}`);
        } else {
          // 기존 사용자 - 홈으로 이동
          router.push('/home');
        }
      } catch (error: any) {
        alert(error.message || '카카오 로그인에 실패했습니다.');
        router.push('/');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // 로딩 화면
  return (
    <Loading className="min-h-screen" />
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <Loading className="min-h-screen" />
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
