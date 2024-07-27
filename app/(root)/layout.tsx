import Header from "@/components/Header/Header";
import Menu from "@/components/Menu/Menu";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-full flex flex-col items-center justify-between">
        <div className="w-full">
          <Header />
        </div>
        <div className="relative w-full flex justify-center items-center">
          <Menu className="fixed bottom-0" />
        </div>
        <div className="max-w-md">{children}</div>
      </div>
    );
  }
  