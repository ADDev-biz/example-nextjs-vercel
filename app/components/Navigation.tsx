"use client";

import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Navigation() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  return (
    <nav className="navbar bg-base-100 shadow-lg px-4 sm:px-6 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/gcrhealth">GCR Health</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          Next.js App
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/gcrhealth">GCR Health</Link></li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {isLoading ? (
          <div className="loading loading-spinner loading-sm"></div>
        ) : isAuthenticated && user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">{user.given_name?.[0] || user.email?.[0] || 'U'}</span>
                </div>
              </div>
              <span className="text-sm hidden md:inline">
                {user.given_name || user.email}
              </span>
            </div>
            <LogoutLink className="btn btn-outline btn-sm sm:btn-md rounded-full">
              Log out
            </LogoutLink>
          </>
        ) : (
          <>
            <LoginLink className="btn btn-primary btn-sm sm:btn-md rounded-full">
              Sign in
            </LoginLink>
            <RegisterLink className="btn btn-secondary btn-sm sm:btn-md rounded-full">
              Sign up
            </RegisterLink>
          </>
        )}
      </div>
    </nav>
  );
}
