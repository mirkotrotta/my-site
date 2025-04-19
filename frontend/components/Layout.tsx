'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'
import SocialLinks from '@/components/SocialLinks'
import GlobalContainer from '@/components/ui/GlobalContainer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  const updateHeaderHeight = () => {
    const header = document.querySelector('header')
    if (header) {
      const height = header.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      updateHeaderHeight()
    }, 50)
    return () => clearTimeout(timer)
  }, [mobileOpen])

  const toggleDarkMode = () => {
    const isDark = !darkMode
    setDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }

  return (
    <div className="font-sans text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="sticky-header border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
        <GlobalContainer>
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-6">
              <Link href="/">
                <span className="font-bold text-lg tracking-tight text-blue-500 dark:text-gray-100 hover:text-blue-600 dark:hover:text-gray-200">
                  Mirko Trotta
                </span>
              </Link>
              <nav className="hidden md:flex text-sm">
                {navItems.map(({ href, label }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`px-4 py-4 transition-colors ${
                        isActive
                          ? 'border-b-2 border-blue-500'
                          : 'hover:bg-gray-50 hover:text-black dark:hover:bg-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="border border-gray-400 dark:border-gray-600 p-2 w-8 h-8 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden border border-gray-400 dark:border-gray-600 p-2 w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </GlobalContainer>
        {mobileOpen && (
          <GlobalContainer className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3 space-y-2 bg-white dark:bg-gray-900">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`block px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </GlobalContainer>
        )}
      </header>

      <main className="flex-grow w-full py-16">
        <GlobalContainer>{children}</GlobalContainer>
      </main>
      <footer className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs py-16 text-gray-600 dark:text-gray-400">
        <GlobalContainer className="text-center">
          <p className="font-semibold text-lg">Mirko Trotta – Full Stack Developer</p>
          <p className="mt-1">Remote | Open Source Contributor</p>
          <SocialLinks className="mt-3 justify-center" />
          <p className="mt-4 text-gray-400">
            © {new Date().getFullYear()} All rights reserved. Built with Next.js & FastAPI.
          </p>
        </GlobalContainer>
      </footer>
    </div>
  )
}
