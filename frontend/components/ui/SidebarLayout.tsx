import { ReactNode } from 'react';
import GlobalContainer from './GlobalContainer';

type SidebarLayoutProps = {
  children: ReactNode;
  sidebarLeft?: ReactNode;
  sidebarRight?: ReactNode;
  className?: string;
};

/**
 * SidebarLayout - A flexible layout component that can accommodate one or two sidebars
 * along with the main content, styled with IBM-inspired aesthetics.
 * 
 * @param children - The main content
 * @param sidebarLeft - Optional left sidebar (e.g., SidebarA for navigation)
 * @param sidebarRight - Optional right sidebar (e.g., SidebarB for related content)
 * @param className - Additional CSS classes
 */
export default function SidebarLayout({
  children,
  sidebarLeft,
  sidebarRight,
  className = '',
}: SidebarLayoutProps) {
  // Determine grid template based on which sidebars are present
  let gridTemplateClass = '';
  
  if (sidebarLeft && sidebarRight) {
    gridTemplateClass = 'lg:grid-cols-[240px_1fr_280px] lg:gap-10';
  } else if (sidebarLeft) {
    gridTemplateClass = 'lg:grid-cols-[240px_1fr] lg:gap-10';
  } else if (sidebarRight) {
    gridTemplateClass = 'lg:grid-cols-[1fr_280px] lg:gap-10';
  }

  return (
    <GlobalContainer className={`py-12 ${className}`}>
      <div className={`grid grid-cols-1 gap-y-8 ${gridTemplateClass}`}>
        {sidebarLeft && (
          <div className="order-1 lg:order-1">
            {sidebarLeft}
          </div>
        )}
        
        <div className={`order-2 ${sidebarLeft ? 'lg:order-2' : ''}`}>
          {children}
        </div>
        
        {sidebarRight && (
          <div className="order-3">
            {sidebarRight}
          </div>
        )}
      </div>
    </GlobalContainer>
  );
} 