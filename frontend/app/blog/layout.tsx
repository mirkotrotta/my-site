// app/blog/layout.tsx
import { ReactNode } from "react";
import Layout from "@/components/Layout";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <div className="py-12 bg-white dark:bg-gray-900">
        <h1 className="text-5xl font-normal text-gray-900 dark:text-white pb-2 my-8">
          System Logs
        </h1>
        {children}
      </div>
    </Layout>
  );
}
