import Menu from "@/components/Menu/Menu";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="bg-gray-300 max-w-sm">
        <div className="relative">
          <Menu className="fixed bottom-0 w-full" />
        </div>
        <div>{children}</div>
      </div>
    );
  }
  