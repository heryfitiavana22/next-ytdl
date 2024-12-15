"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { PropsWithChildren } from "react";

export function AssureClient({ children }: AssureClientProps) {
  const isClient = useIsClient();

  if (isClient) return children;

  return null;
}

type AssureClientProps = PropsWithChildren;
