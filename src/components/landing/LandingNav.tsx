import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-black/85">
            VibePM
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            to="/framework"
            className="rounded-lg px-3 py-1.5 text-sm text-black/45 transition-colors hover:text-black/75 hover:bg-black/[0.04]"
          >
            Docs
          </Link>
          <Link
            to="/system"
            className="rounded-lg px-3 py-1.5 text-sm text-black/45 transition-colors hover:text-black/75 hover:bg-black/[0.04]"
          >
            System
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-sm text-black/50 hover:text-black/80 hover:bg-black/[0.04]"
          >
            <Link to="/auth">Log in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-black text-white hover:bg-black/90 font-medium text-sm px-5"
          >
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
