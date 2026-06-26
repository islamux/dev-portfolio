"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  const isStatic = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "static";

  useEffect(() => {
    router.replace(isStatic ? "/en/" : "/en");
  }, [router, isStatic]);

  return null;
}
