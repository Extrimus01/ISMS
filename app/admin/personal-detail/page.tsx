import PersonalDetails from "@/components/admin/AdminDetails";

interface PageProps {
  params: { id: string };
}

export default function AdminPage({ params }: PageProps) {
  return (
      <PersonalDetails />
  );
}
