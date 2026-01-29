"use client";

import React from "react";

type ProviderProps = {
  children: React.ReactNode;
};

type Provider = React.ComponentType<ProviderProps>;

interface CombinedProviderProps {
  providers: Provider[];
  children: React.ReactNode;
}

/**
 * CombinedProvider - A component that combines multiple providers into a single wrapper
 *
 * @param providers - An array of provider components to be nested
 * @param children - The child components to be wrapped by all providers
 *
 * Example usage:
 * ```tsx
 * const providers = [QueryProvider, ThemeProvider, AuthProvider];
 *
 * <CombinedProvider providers={providers}>
 *   <App />
 * </CombinedProvider>
 * ```
 */
export default function ProviderReducer({
  providers,
  children,
}: CombinedProviderProps) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children as React.ReactElement
  );
}
