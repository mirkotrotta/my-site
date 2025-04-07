// components/blog/mdxComponents.tsx

"use client";

import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

export const components: MDXComponents = {
  a: ({ href = "#", children, ...props }) => (
    <Link
      href={href}
      {...props}
      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
    >
      {children}
    </Link>
  ),
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 {...props} className="text-3xl font-bold mt-6 mb-2" />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 {...props} className="text-2xl font-bold mt-5 mb-2" />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 {...props} className="text-xl font-semibold mt-4 mb-2" />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p {...props} className="leading-relaxed mb-4" />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className="list-disc list-inside mb-4" />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className="list-decimal list-inside mb-4" />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li {...props} className="mb-1" />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400 my-4"
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      {...props}
      className="bg-gray-100 dark:bg-gray-800 text-pink-600 px-1 py-0.5 rounded text-sm"
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      className="bg-gray-900 text-white p-4 rounded text-sm overflow-x-auto mb-4"
    />
  ),
};
