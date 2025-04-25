export default function GermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="de">
      {children}
    </div>
  );
} 