"use client";

import { useRouter } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ClickableRow({ href, children, className = "" }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLTableRowElement>) {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"], [role="dialog"]')) return;
    router.push(href);
  }

  return (
    <tr onClick={handleClick} className={`cursor-pointer ${className}`}>
      {children}
    </tr>
  );
}
