# FinSight Frontend

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
.
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # 루트 레이아웃
│   │   ├── page.tsx       # 홈 페이지
│   │   └── globals.css    # 전역 스타일
│   ├── components/         # React 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── lib/                # 유틸리티 함수
│   ├── store/              # Zustand 스토어
│   └── types/              # TypeScript 타입 정의
└── public/                 # 정적 파일
```

## 사용 가능한 스크립트

- `pnpm dev` - 개발 서버 시작
- `pnpm build` - 프로덕션 빌드
- `pnpm start` - 프로덕션 서버 시작
- `pnpm lint` - ESLint 실행

