import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTAButtons = () => {
  return (
    <div className="mx-auto mt-8 flex items-center justify-center gap-4">
      <Link to="/home">
        <Button className="rounded-md bg-slate-900 px-6 py-3 text-white shadow-md">
          Get started now
        </Button>
      </Link>

      <Link to="#">
        <Button variant="outline" className="rounded-md px-6 py-3">
          Explore more
        </Button>
      </Link>
    </div>
  );
};

export default CTAButtons;
