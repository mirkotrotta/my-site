"use client";

import Layout from "@/components/Layout";
import GlobalContainer from "@/components/ui/GlobalContainer";

export default function ContainerTestPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Global Container Test</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            This page demonstrates the GlobalContainer component with different configurations.
          </p>
        </div>

        {/* Default container with box to visualize margins */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Default Container</h2>
          <div className="border border-gray-300 dark:border-gray-700 rounded-md">
            <GlobalContainer className="py-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <div className="bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700 rounded">
                <p>This is the default container with default padding and max-width constraints.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Resize your browser window to see how it responds to different screen sizes.
                </p>
              </div>
            </GlobalContainer>
          </div>
        </section>

        {/* Fluid container */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Fluid Container (No Max Width)</h2>
          <div className="border border-gray-300 dark:border-gray-700 rounded-md">
            <GlobalContainer fluid className="py-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <div className="bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700 rounded">
                <p>This container uses the fluid option to remove max-width constraints.</p>
                <p className="text-sm text-gray-500 mt-2">
                  It will expand to fill the entire width of the viewport while maintaining consistent padding.
                </p>
              </div>
            </GlobalContainer>
          </div>
        </section>

        {/* Custom element type */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Custom Element Type</h2>
          <div className="border border-gray-300 dark:border-gray-700 rounded-md">
            <GlobalContainer as="section" className="py-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <div className="bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700 rounded">
                <p>This container uses a &lt;section&gt; tag instead of a &lt;div&gt;.</p>
                <p className="text-sm text-gray-500 mt-2">
                  The component is flexible and can use any valid HTML element as its container.
                </p>
              </div>
            </GlobalContainer>
          </div>
        </section>

        {/* Responsive guide */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Responsive Behavior</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 text-left">Breakpoint</th>
                  <th className="p-2 text-left">Screen Size</th>
                  <th className="p-2 text-left">Padding</th>
                  <th className="p-2 text-left">Max Width</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2">Default (xs)</td>
                  <td className="p-2">&lt; 640px</td>
                  <td className="p-2">1rem (16px)</td>
                  <td className="p-2">640px</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2">sm</td>
                  <td className="p-2">≥ 640px</td>
                  <td className="p-2">1.5rem (24px)</td>
                  <td className="p-2">768px</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2">md</td>
                  <td className="p-2">≥ 768px</td>
                  <td className="p-2">2rem (32px)</td>
                  <td className="p-2">1024px</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2">lg</td>
                  <td className="p-2">≥ 1024px</td>
                  <td className="p-2">3rem (48px)</td>
                  <td className="p-2">1280px</td>
                </tr>
                <tr>
                  <td className="p-2">xl</td>
                  <td className="p-2">≥ 1280px</td>
                  <td className="p-2">3rem (48px)</td>
                  <td className="p-2">1536px</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
} 