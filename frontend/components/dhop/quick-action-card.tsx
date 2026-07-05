import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export function QuickActionCard({
  label,
  description,
  href,
  icon: Icon,
  onClick,
}: {
  label: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 transition-all hover:border-primary/40 hover:bg-accent/30 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
          <Icon className="size-5" />
        </span>
        <h4 className="font-semibold text-foreground text-sm">{label}</h4>
      </div>
      <p className="text-[11px] text-muted-foreground leading-normal">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group block w-full focus-visible:outline-none"
      type="button"
    >
      {content}
    </button>
  );
}
export default QuickActionCard;
