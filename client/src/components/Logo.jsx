import React from "react";
import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }) => {
  return (
    <h3 className={cn("font-faustina text-xl font-bold", className)} {...props}>
      Hire<span className="text-primary">Wise</span>
    </h3>
  );
};

export default Logo;
