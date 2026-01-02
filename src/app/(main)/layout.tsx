import BottomTab from '@/components/navigation/BottomTab';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-white dark:bg-gray-900 shadow-lg">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
      <BottomTab />
    </div>
  );
}

