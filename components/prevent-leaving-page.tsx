"use client";

import { useEffect, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

export function PreventLeavingPage({
  title = "Changes you made may not be saved.",
  isDirty,
  children,
}: PreventLeavingPageProps) {
  const router = useRouter();

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
     * Used to prevent navigation when user clicks a navigation `<Link />` or `<a />`.
     * @param e The triggered event.
     */
    let lastClickTime = 0;
    const debounceTime = 300; // milliseconds

    const handleClick = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastClickTime < debounceTime) return;
      lastClickTime = now;

      let target = event.target as HTMLAnchorElement;
      while (target && target.tagName !== "A") {
        target = target.parentElement as HTMLAnchorElement;
      }

      if (target && target.tagName === "A") {
        target = target as HTMLAnchorElement;

        if (
          isDirty &&
          typeof window !== "undefined" &&
          target.href !== window.location.href
        ) {
          window.history.pushState(null, document.title, window.location.href);
          const isOk = windowConfirm();
          if (isOk) {
            router.push(target.href);
          }
        }
      }
    };
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
      document.addEventListener("click", handleClick);
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    /* ************** Return from useEffect closing listeners ************** */
    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("click", handleClick);
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
