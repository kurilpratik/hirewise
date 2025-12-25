import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // shadcn button
import Logo from "../Logo";
import { Search } from "lucide-react";

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
            <li>
              <Link to="#">Pages</Link>
            </li>
            <li>
              <Link to="#">More Pages</Link>
            </li>
            <li>
              <Link to="#">Information</Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-2 text-sm text-slate-600 md:inline-flex">
            <Search className="h-4 text-neutral-400" />
            Search
          </button>

          <Button
            variant="ghost"
            className="hidden bg-amber-100 text-amber-900 md:inline-flex"
          >
            Signin
          </Button>
          <Button asChild>
            <Link
              to="/home"
              className="bg-accent rounded-md px-4 py-2 text-white"
            >
              Get Started
            </Link>
          </Button>

          {/* Mobile menu trigger (simple) */}
          <button className="rounded-md bg-slate-100 p-2 md:hidden">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
