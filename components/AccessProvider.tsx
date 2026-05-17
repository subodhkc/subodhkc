// components/AccessProvider.tsx
// React context + provider for the "Request Access" modal. Wraps the homepage
// (or any subtree containing gated products) so ProductCard / ManifestRow can
// trigger the modal from anywhere.
"use client";

import * as React from "react";
import type { Product } from "@/data/products";
import { RequestAccessModal } from "./RequestAccessModal";

const AccessCtx = React.createContext<(p: Product) => void>(() => {});

export function useRequestAccess() {
  return React.useContext(AccessCtx);
}

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = React.useState<Product | null>(null);
  return (
    <AccessCtx.Provider value={setProduct}>
      {children}
      <RequestAccessModal product={product} onClose={() => setProduct(null)} />
    </AccessCtx.Provider>
  );
}
