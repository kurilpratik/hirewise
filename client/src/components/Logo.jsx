import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Logo = ({ className, ...props }) => {
  return (
    <h3 className={cn("font-faustina text-xl font-bold", className)} {...props}>
      <Link to={"/"}>
        Hire<span className="text-primary">Wise</span>
      </Link>
    </h3>
  );
};

export default Logo;
