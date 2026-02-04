'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeLayout from '@/components/onboarding/WelcomeLayout';
import InterestSelection from '@/components/onboarding/InterestSelection';
import { INTERESTS } from '@/constants/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showText, setShowText] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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
  }, [step]);

  // handleNext는 페이지 이동만 담당
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      router.push('/home');
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div 
      className="relative w-full min-h-dvh mx-auto overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 200% 200% at 85% 21.21%, #151540 5.77%, #131416 100%)',
      }}
    >
      {/* Step 1, 2 */}
      {(step === 1 || step === 2) && (
        <WelcomeLayout
          step={step as 1 | 2}
          showText={showText}
          onNext={handleNext}
        />
      )}

      {/* Step 3 */}
      {step === 3 && (
        <InterestSelection
          interests={INTERESTS}
          selectedInterests={selectedInterests}
          toggleInterest={toggleInterest}
          handleNext={handleNext}
          isButtonEnabled={isButtonEnabled}
        />
      )}
    </div>
  );
}