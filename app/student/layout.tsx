export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="flex-1 ml-0 md:ml-64 p-6">{children}</main>
    </div>
  );
}
