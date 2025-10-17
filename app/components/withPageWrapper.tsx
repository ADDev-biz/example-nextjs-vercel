"use client";

import { ComponentType } from "react";
import PageWrapper from "./PageWrapper";

interface WithPageWrapperOptions {
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

// Higher-Order Component that wraps any page with PageWrapper
export function withPageWrapper<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPageWrapperOptions = {}
) {
  const WrappedPage = (props: P) => {
    return (
      <PageWrapper
        title={options.title}
        description={options.description}
        className={options.className}
        showHeader={options.showHeader}
        showFooter={options.showFooter}
      >
        <WrappedComponent {...props} />
      </PageWrapper>
    );
  };

  // Set display name for debugging
  WrappedPage.displayName = `withPageWrapper(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WrappedPage;
}

// Alternative: A hook-based approach for more flexibility
export function usePageWrapper(options: WithPageWrapperOptions = {}) {
  return {
    PageWrapperComponent: ({ children }: { children: React.ReactNode }) => (
      <PageWrapper {...options}>{children}</PageWrapper>
    ),
  };
}
