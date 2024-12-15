"use client";

import { useIsClient } from "@/hooks/use-is-client";
import React from "react";

type ComponentType<T extends Object> = (props: T) => React.JSX.Element;

export function assureClient<T extends Object>(
  WrappedComponent: ComponentType<T>
) {
  return (props: T) => {
    const isClient = useIsClient();

    if (isClient) return <WrappedComponent {...props} />;

    return <></>;
  };
}
