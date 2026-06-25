import { StudentLayout } from "@/components/layout/StudentLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <StudentLayout>{children}</StudentLayout>;
}
