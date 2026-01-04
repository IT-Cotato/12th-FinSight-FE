import BottomTab from '@/components/navigation/BottomTab';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen shadow-lg">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
      <BottomTab />
    </div>
  );
}

