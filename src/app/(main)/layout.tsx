import BottomTab from '@/components/navigation/BottomTab';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen shadow-lg">
      <main className="flex-1 min-h-0 pb-[100px] flex flex-col">{children}</main>
      <BottomTab />
    </div>
  );
}

