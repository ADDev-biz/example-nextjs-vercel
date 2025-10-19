"use client";

import { withPageWrapper } from "../components/withPageWrapper";
import Link from "next/link";

function UnauthorizedPageContent() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-base-content mb-4">
            Access Denied
          </h1>

          <p className="text-xl text-base-content/70 mb-6">
            You do not have permission to access this page.
          </p>

          <div className="alert alert-warning mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-bold">POC-Admin Role Required</h3>
              <div className="text-sm">
                This page requires the <code className="bg-base-300 px-2 py-1 rounded">POC-Admin</code> role with the{" "}
                <code className="bg-base-300 px-2 py-1 rounded">zz-addev-role-admin</code> permission.
              </div>
            </div>
          </div>

          <p className="text-base-content/60 mb-8">
            If you believe you should have access to this page, please contact your system administrator.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn btn-primary">
              Go to Home
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const UnauthorizedPage = withPageWrapper(UnauthorizedPageContent, {
  title: "Access Denied",
  description: "You do not have permission to access this page",
  className: "bg-gradient-to-br from-red-50 to-orange-100",
});

export default UnauthorizedPage;
