import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        new: "bg-emerald-500 text-white rounded-full text-[10px] px-2.5 py-0.5 font-bold",
        trending:
          "bg-amber-500 text-white rounded-full text-[10px] px-2.5 py-0.5 font-bold",
        hot: "bg-rose-500 text-white rounded-full text-[10px] px-2.5 py-0.5 font-bold",
        bestSeller:
          "bg-orange-600 text-white rounded-full text-[10px] px-2.5 py-0.5 font-bold",
        discount:
          "bg-rose-500 text-white rounded-md text-xs font-semibold px-2 py-0.5",
        goldPill:
          "bg-amber-400 text-amber-950 font-bold rounded-full text-[11px] px-3 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
