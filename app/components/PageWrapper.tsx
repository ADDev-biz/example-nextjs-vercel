"use client";

import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function PageWrapper({
  children,
  title,
  description,
  className = "",
  showHeader = true,
  showFooter = true,
}: PageWrapperProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && (
        <header className="bg-base-100 shadow-sm border-b border-base-300">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-base-content">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-base-content/70 mt-1">{description}</p>
                )}
              </div>
              <nav className="flex gap-4">
                <a href="/" className="btn btn-ghost btn-sm">
                  Home
                </a>
                <a href="/about" className="btn btn-ghost btn-sm">
                  About
                </a>
                <a href="/contact" className="btn btn-ghost btn-sm">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-base-200 border-t border-base-300">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-base-content/70">
              <p>&copy; 2024 Your App. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
