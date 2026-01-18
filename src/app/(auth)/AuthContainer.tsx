'use client';

import Header from '../../components/Header';
import Button from '../../components/Button';
import StepIndicator from '../../components/Step';

interface AuthContainerProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  buttonText?: string;
  buttonDisabled?: boolean;
  showBackButton?: boolean;
  contentMarginTop?: string; // 이게 될까?
}

export default function AuthContainer({
  title,
  currentStep,
  totalSteps,
  children,
  onNext,
  onBack,
  buttonText = '다음',
  buttonDisabled = false,
  showBackButton = true,
  contentMarginTop = '170px',
}: AuthContainerProps) {
  return (
    <div 
      className="flex flex-col mx-auto"
      style={{
        width: '390px',
        height: '844px',
        background: 'var(--color-bg-100, #131416)',
        position: 'relative',
      }}
    >
      <Header 
        title={title}
        onBack={onBack}
        showBackButton={showBackButton}
      />

      {totalSteps > 0 && (  // ✅ totalSteps가 0보다 클 때만 표시
        <StepIndicator 
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}

      {/* 콘텐츠 영역 */}
      <div 
        style={{
          marginTop: contentMarginTop,  // ✅ prop으로 받은 값 사용
          paddingLeft: '20px',
          paddingRight: '20px',
          flex: 1,
        }}
      >
        {children}
      </div>

      <Button
        text={buttonText}
        onClick={onNext}
        disabled={buttonDisabled}
      />
    </div>
  );
}