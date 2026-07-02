"use client";

import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SearchDialog from './SearchDialog';
import ReadingPreferences from '../shared/ReadingPreferences';
import LibraryNavIcon from './LibraryNavIcon';

// ponytail: single mapping object for social media SVGs
const socialIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  youtube: (
    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  github: (
    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  ),
  instagram: (
    <svg className="h-4.5 w-4.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  facebook: (
    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  )
};

interface NavbarProps {
  settings?: {
    logoText?: string;
    headerMenu?: Array<{
      label: string;
      url: string;
      childLinks?: Array<{
        label: string;
        url: string;
      }>;
    }>;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  } | null;
}

export default function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(formatted);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (pathname?.startsWith('/studio')) return null;

  const menuItems = settings?.headerMenu || [
    { label: "Learn", url: "/learn" },
    { label: "AI Career Program™", url: "/career-program" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" }
  ];

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<number | null>(null);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMobileDropdown(null);
    setMobileSettingsOpen(false);
  }, [pathname]);

  /* ponytail: refactored Header to Navbar aligning with clean layout specifications */
  return (
    <>
      <header className="w-full bg-nav-bg text-nav-inactive border-b border-nav-border transition-colors">
        {/* Top Logo Panel (Desktop Only) */}
        <div className="hidden md:block mx-auto max-w-6xl px-6 py-6 text-center border-b border-nav-border">
          <Link href="/" className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-nav-active hover:opacity-90 transition-opacity">
            {settings?.logoText || "TheAskt"}
          </Link>
        </div>

        {/* Navigation / Info Bar */}
        <div className="bg-nav-bg py-3 transition-colors">
          <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-xs">
            {/* Left side: Date (Desktop Only) */}
            <div className="hidden md:block font-medium text-text-muted">
              {currentDate}
            </div>

            {/* Center: Main Nav Links (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-6 font-semibold text-nav-inactive">
              {menuItems.map((item, idx) => {
                const isActive = pathname === item.url;
                return (
                  <div key={idx} className="relative group/menu">
                    {item.childLinks && item.childLinks.length > 0 ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === idx ? null : idx);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setOpenDropdown(null);
                          }}
                          aria-expanded={openDropdown === idx}
                          aria-haspopup="true"
                          suppressHydrationWarning
                          className="flex items-center gap-1 hover:text-nav-hover transition-colors cursor-pointer py-1"
                        >
                           {item.label} <span className="text-[7px]">▼</span>
                        </button>
                        <div 
                          className={`absolute top-full left-0 min-w-[160px] rounded-lg border border-border-primary bg-bg-card p-2 shadow-sm z-50 ${
                            openDropdown === idx ? 'block' : 'hidden group-hover/menu:block group-focus-within/menu:block'
                          }`}
                        >
                          {item.childLinks.map((child, cidx) => (
                            <Link
                              key={cidx}
                              href={child.url}
                              onClick={() => setOpenDropdown(null)}
                              className="block rounded-md px-3 py-1.5 text-xs text-text-body hover:bg-bg-secondary hover:text-nav-hover transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.url}
                        className={`py-1 transition-colors hover:text-nav-hover ${
                          isActive ? "text-nav-active font-bold border-b-2 border-btn-accent-bg" : "text-nav-inactive"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right side: Actions (Desktop Only) */}
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={() => setSearchOpen(true)}
                suppressHydrationWarning
                className="text-nav-inactive hover:text-nav-hover transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>
              <LibraryNavIcon className="h-8 w-8" />
              <ReadingPreferences />
              <Link
                href="/career-program"
                className="bg-btn-accent-bg hover:bg-btn-accent-hover text-btn-accent-text px-4 py-1.5 rounded-full font-bold text-xs transition-colors shadow-sm active:scale-98"
              >
                Join Free
              </Link>
            </div>

            {/* Mobile Navbar Row (Mobile Only) */}
            <div className="flex md:hidden w-full items-center justify-between text-nav-inactive py-1">
              {/* Left: Brand Logo Link */}
              <Link 
                href="/" 
                className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-nav-active hover:opacity-90 transition-opacity"
              >
                {settings?.logoText || "TheAskt"}
              </Link>
              
              {/* Right: Actions Cluster */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  suppressHydrationWarning
                  className="text-nav-inactive hover:text-nav-hover transition-colors cursor-pointer p-1 rounded-full hover:bg-bg-secondary flex items-center justify-center h-9 w-9"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>

                <LibraryNavIcon className="h-9 w-9" />

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle Menu"
                  suppressHydrationWarning
                  className="text-nav-inactive hover:text-nav-hover transition-colors cursor-pointer p-1 rounded-full hover:bg-bg-secondary flex items-center justify-center h-9 w-9"
                >
                  {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Underlay (Backdrop) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-xs md:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel (Slide over from right) */}
      <div 
        className={`fixed top-0 right-0 bottom-0 z-[80] w-[75%] max-w-[300px] bg-bg-card border-l border-border-primary flex flex-col p-6 shadow-2xl transition-transform duration-350 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border-primary pb-4 mb-6">
          <span className="font-sans text-xs font-bold text-text-muted uppercase tracking-wider">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            suppressHydrationWarning
            className="text-text-muted hover:text-text-h transition-colors cursor-pointer p-1.5 rounded-full hover:bg-bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body (Links list) */}
        <div className="flex flex-col h-[calc(100vh-120px)] justify-between pb-4">
          <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
            {menuItems.map((item, idx) => {
              const isDropdownOpen = activeMobileDropdown === idx;
              const hasChildren = item.childLinks && item.childLinks.length > 0;
              
              return (
                <div key={idx} className="border-b border-border-primary/40 pb-2.5 last:border-0 last:pb-0">
                  {hasChildren ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveMobileDropdown(isDropdownOpen ? null : idx)}
                        suppressHydrationWarning
                        className="flex w-full items-center justify-between text-left font-sans text-sm font-semibold text-text-h hover:text-link transition-colors cursor-pointer py-1"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-250 ${isDropdownOpen ? 'rotate-180 text-link' : 'text-text-muted'}`} />
                      </button>
                      {isDropdownOpen && (
                        <div className="pl-3 border-l border-border-primary space-y-2.5 pt-1.5 ml-0.5 animate-fade-in">
                          {item.childLinks!.map((child, cidx) => (
                            <Link
                              key={cidx}
                              href={child.url}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block font-sans text-xs font-medium text-text-secondary hover:text-link transition-colors py-1"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-sans text-sm font-semibold text-text-h hover:text-link transition-colors py-1"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
            {/* Reading Settings Accordion */}
            <div className="border-b border-border-primary/40 pb-2.5">
              <button
                onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                suppressHydrationWarning
                className="flex w-full items-center justify-between text-left font-sans text-sm font-semibold text-text-h hover:text-link transition-colors cursor-pointer py-1"
              >
                <span>Reading Settings</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-250 ${mobileSettingsOpen ? 'rotate-180 text-link' : 'text-text-muted'}`} />
              </button>
              {mobileSettingsOpen && (
                <div className="pl-3 border-l border-border-primary pt-2.5 ml-0.5 animate-fade-in">
                  <ReadingPreferences isInline={true} />
                </div>
              )}
            </div>
          </nav>

          {/* Drawer Footer */}
          <div className="pt-4 border-t border-border-primary space-y-4">
            {/* Social icons */}
            {settings?.socialLinks && settings.socialLinks.length > 0 && (
              <div className="flex items-center gap-5 justify-center text-text-muted/60">
                {settings.socialLinks.map((link, lidx) => {
                  const icon = socialIcons[link.platform.toLowerCase()];
                  if (!icon) return null;
                  return (
                    <a
                      key={lidx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-link transition-colors"
                      title={link.platform}
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            )}

            <Link
              href="/career-program"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-btn-accent-bg hover:bg-btn-accent-hover text-btn-accent-text py-2.5 rounded-full font-bold text-xs transition-colors shadow-sm"
            >
              Join Free AI Career Program™
            </Link>
          </div>
        </div>
      </div>

      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
