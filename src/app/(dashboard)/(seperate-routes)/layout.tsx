import AppHeader from "@/components/shared/app-header";

const Seperaterouteslayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default Seperaterouteslayout;
