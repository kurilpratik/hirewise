import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // shadcn button
import Logo from "../Logo";

const Navbar = () => {
  return (
    <header className="w-full py-6">
      <nav className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-baseline gap-4">
          <Link to="/" className="text-xl font-semibold">
            <Logo className={"text-xl"} />
          </Link>

          <ul className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link
              to="/home"
              className="bg-accent rounded-md px-4 py-2 text-white"
            >
              Try Now
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
