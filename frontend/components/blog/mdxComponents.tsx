// components/blog/mdxComponents.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

// Helper function to check if a node is an image
const isImageNode = (node: ReactNode): boolean => {
  if (!node || typeof node !== 'object') return false;
  
  try {
    // Check if it's a ReactElement
    const element = node as ReactElement;
    
    // Check if it's an img element or has an MDX-transformed img structure
    if (element.type === 'img' || 
        (element.props && 
         typeof element.props === 'object' && 
         'src' in element.props && 
         typeof element.props.src === 'string')) {
      return true;
    }
    
    // Check for our custom Image component
    if (element.type === Image || 
        (typeof element.type === 'string' && 
         element.type.toLowerCase() === 'image')) {
      return true;
    }
  } catch (e) {
    // If any error occurs during checking, it's not an image node
    return false;
  }
  
  return false;
};

// Helper function to check if paragraph only contains an image
const containsOnlyImage = (children: ReactNode): boolean => {
  try {
    // Safely convert children to array
    const childrenArray = React.Children.toArray(children);
    
    // If not exactly one child, it's not just an image
    if (childrenArray.length !== 1) return false;
    
    // Check if the single child is an image
    const child = childrenArray[0];
    return isImageNode(child);
  } catch (e) {
    // If any error occurs during checking, assume it's not just an image
    return false;
  }
};

// Helper to generate heading IDs from text
function generateIdFromChildren(children: React.ReactNode): string {
  const text = React.Children.toArray(children).join(' ');
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export const components: MDXComponents = {
  a: ({ href = "#", children, ...props }) => (
    <Link
      href={href}
      {...props}
      className="text-blue-600 dark:text-blue-400 no-underline hover:underline"
    >
      {children}
    </Link>
  ),
  h1: ({ id, children, ...props }: ComponentPropsWithoutRef<"h1">) => {
    const headingId = id || generateIdFromChildren(children);
    return <h1 {...props} id={headingId} className="text-3xl font-light mt-8 mb-4" >{children}</h1>;
  },
  h2: ({ id, children, ...props }: ComponentPropsWithoutRef<"h2">) => {
    const headingId = id || generateIdFromChildren(children);
    return <h2 {...props} id={headingId} className="text-2xl font-light mt-7 mb-3" >{children}</h2>;
  },
  h3: ({ id, children, ...props }: ComponentPropsWithoutRef<"h3">) => {
    const headingId = id || generateIdFromChildren(children);
    return <h3 {...props} id={headingId} className="text-xl font-light mt-6 mb-3" >{children}</h3>;
  },
  p: ({ children, ...props }) => {
    try {
      // Always directly render children if they're images to avoid p > figure > figcaption nesting
      const childrenArray = React.Children.toArray(children);
      
      // If any child is an image, we need to render children outside of paragraph
      for (const child of childrenArray) {
        if (isImageNode(child)) {
          return <>{children}</>;
        }
      }
      
      // Otherwise, render as a normal paragraph
      return <p {...props} className="leading-relaxed mb-6 text-gray-600 dark:text-gray-300">{children}</p>;
    } catch (e) {
      // Fallback to standard paragraph in case of any errors
      return <p {...props} className="leading-relaxed mb-6 text-gray-600 dark:text-gray-300">{children}</p>;
    }
  },
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className="list-disc list-inside mb-6" />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className="list-decimal list-inside mb-6" />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => {
    const { children, ...restProps } = props;
    
    // Check for inline images in list items and ensure they render properly
    return <li {...restProps} className="mb-2 text-gray-600 dark:text-gray-300">
      {React.Children.map(children, child => {
        // Directly pass through React elements
        return child;
      })}
    </li>;
  },
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
  img: ({ src, alt, ...props }) => {
    if (!src) return null;
    
    // Always render as figure outside of paragraph context
    return (
      <div className="my-6"> {/* Changed from figure to div to avoid nesting issues */}
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={450}
          className="w-full h-auto"
          {...props}
        />
        {alt && (
          <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic">
            {alt}
          </div>
        )}
      </div>
    );
  },
  Image: ({ src, alt, ...props }) => {
    if (!src) return null;
    
    // Always render as div to avoid potential nesting issues
    return (
      <div className="my-6">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={450}
          className="w-full h-auto"
          {...props}
        />
        {alt && (
          <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic">
            {alt}
          </div>
        )}
      </div>
    );
  }
};
