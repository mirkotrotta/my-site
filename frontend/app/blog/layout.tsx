// app/blog/layout.tsx
import { ReactNode } from "react";
import Layout from "@/components/Layout";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
