"use client";

import { useEffect, PropsWithChildren } from "react";

export function PreventLeavingPage({
  title = "Changes you made may not be saved.",
  isDirty,
  children,
}: PreventLeavingPageProps) {
  const windowConfirm = () => {
    return window.confirm(title);
  };

  // Used to make popstate event trigger when back button is clicked.
  // Without this, the popstate event will not fire because it needs there to be a href to return.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, document.title, window.location.href);
    }
  }, []);

  useEffect(() => {
    /**
     * Used to prevent navigation when using `back` browser buttons.
     */
    const handlePopState = () => {
      if (isDirty && typeof window !== "undefined") {
        const isOk = windowConfirm();
        if (isOk) {
          window.history.go(-2);
        }
      } else {
        if (typeof window !== "undefined") window.history.back();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (typeof window !== "undefined") {
      /* *************************** Open listeners ************************** */
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    /* ************** Return from useEffect closing listeners ************** */
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return <>{children}</>;
}

type PreventLeavingPageProps = PropsWithChildren<{
  isDirty: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  yesText?: string;
  noText?: string;
}>;
