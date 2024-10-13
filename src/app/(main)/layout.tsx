import ProtectedRoutes from "@/components/functional/protected-routes";
import Header from "@/components/ui/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoutes>
      <Header />
      <div className="p-4">{children}</div>
    </ProtectedRoutes>
  );
}
