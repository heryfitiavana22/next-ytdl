"use client";

import { useIsClient } from "@/hooks/use-is-client";
import React from "react";

type ComponentType<T extends object> = (props: T) => React.JSX.Element;

export function assureClient<T extends object>(
  WrappedComponent: ComponentType<T>
) {
  const Component = (props: T) => {
    const isClient = useIsClient();

    if (isClient) return <WrappedComponent {...props} />;

    return <></>;
  };
  Component.displayName = `AssureClient(${WrappedComponent.name})`;
  return Component;
}
