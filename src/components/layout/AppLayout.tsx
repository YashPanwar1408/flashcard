'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

import {
  BarChart,
  BookOpen,
  Home,
  Layers,
  Menu,
  PlusCircle,
  Settings,
} from 'lucide-react';

const routes = [
  {
    label: 'Home',
    icon: Home,
    href: '/',
    color: 'text-sky-500',
    gradient: 'from-sky-400 to-sky-600'
  },
  {
    label: 'Study',
    icon: BookOpen,
    href: '/review',
    color: 'text-violet-500',
    gradient: 'from-violet-400 to-violet-600'
  },
  {
    label: 'Statistics',
    icon: BarChart,
    href: '/dashboard',
    color: 'text-pink-500',
    gradient: 'from-pink-400 to-pink-600'
  },
  {
    label: 'Decks',
    icon: Layers,
    href: '/decks',
    color: 'text-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  {
    label: 'Add Card',
    icon: PlusCircle,
    href: '/create',
    color: 'text-green-500',
    gradient: 'from-green-400 to-green-600'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-gray-500',
    gradient: 'from-gray-400 to-gray-600'
  },
];

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Always force dark mode on mount
  useEffect(() => {
    // Apply dark mode to document
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    
    // Store preference in localStorage
    localStorage.setItem('darkMode', 'true');
  }, []);

  return (
    <div className="h-full relative dark">
      {/* Mobile Navigation */}
      <div className="block md:hidden fixed inset-x-0 top-0 h-16 z-50 border-b bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-400" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Flashcard</span>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-gray-900 border-r border-gray-800">
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
                  <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-purple-400" />
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Flashcard</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4">
                  <div className="space-y-2">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`
                          flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200
                          ${pathname === route.href 
                            ? `bg-gradient-to-r ${route.gradient} text-white font-medium shadow-md`
                            : 'hover:bg-gray-800 hover:scale-105 transform'
                          }
                        `}
                      >
                        <route.icon className={`h-5 w-5 ${pathname === route.href ? 'text-white' : route.color}`} />
                        <span>{route.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 border-r border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="p-6 flex items-center gap-2 border-b border-gray-800">
          <BookOpen className="h-7 w-7 text-purple-400" />
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Flashcard</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4">
          <nav className="space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`
                  flex items-center gap-3 px-4 py-3.5 text-sm rounded-xl transition-all duration-200 
                  ${pathname === route.href 
                    ? `bg-gradient-to-r ${route.gradient} text-white font-medium shadow-md`
                    : 'hover:bg-gray-800 hover:scale-105 transform'
                  }
                `}
              >
                <route.icon className={`h-5 w-5 ${pathname === route.href ? 'text-white' : route.color}`} />
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-72 pt-16 md:pt-0 min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="h-full p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
} 