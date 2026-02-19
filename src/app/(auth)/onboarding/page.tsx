'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeLayout from '@/components/onboarding/WelcomeLayout';
import InterestSelection from '@/components/onboarding/InterestSelection';
import { INTERESTS } from '@/constants/onboarding';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);  // ✅ 추가

  /* 추가: Zustand 스토어에서 상태와 액션 가져오기 */
  const { 
    step, 
    showText, 
    selectedInterests, 
    setStep, 
    setShowText, 
    toggleInterest,
    saveInterests,
  } = useOnboardingStore();

  /* 변경: selectedInterests가 스토어 값이므로 그대로 사용 */
  const isButtonEnabled = selectedInterests.length >= 3;

  // showText는 useEffect에서만 관리
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (step === 2) {
      setShowText(true);
    }
  }, [step, setShowText]); // setShowText 의존성 추가

  // handleNext는 페이지 이동만 담당
  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // ✅ 관심분야 저장 API 호출
      setLoading(true);
      const result = await saveInterests();
      setLoading(false);

      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/home');
      } else {
        alert(result.message || '저장에 실패했습니다.');
      }
    }
  };

  return (
    <div 
      className="relative w-full min-h-dvh mx-auto overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 200% 200% at 85% 21.21%, #151540 5.77%, #131416 100%)',
      }}
    >
      {(step === 1 || step === 2) && (
        <WelcomeLayout
          step={step as 1 | 2}
          showText={showText}
          onNext={handleNext}
        />
      )}

      {step === 3 && (
        <InterestSelection
          interests={INTERESTS}
          selectedInterests={selectedInterests}
          toggleInterest={toggleInterest}
          handleNext={handleNext}
          isButtonEnabled={isButtonEnabled && !loading}  // ✅ 수정
        />
      )}
    </div>
  );
}