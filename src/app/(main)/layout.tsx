import ProtectedRoutes from "@/components/functional/protected-routes";
import Header from "@/components/ui/header";

export const metadata = {
  title: "Picshaw - Share memories at events",
  description:
    "Capture and share unforgettable moments from any event with ease. Our app allows users to create event-specific photo galleries where guests can upload images from weddings, birthdays, and other special occasions.",
};

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
