"use client";

import { useRouter } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ClickableRow({ href, children, className = "" }: Props) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(href)}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </tr>
  );
}
