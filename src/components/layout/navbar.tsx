"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { auth, signOut } from "@/lib/firebase";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/art-videos", label: "Art Videos" },
  { href: "/about", label: "About" },
  { href: "/art-pricing", label: "Art Pricing" },
  { href: "/promoting-other-artists", label: "Promoting Other Artists" },
  { href: "/contact", label: "Contact" },
];

const ADMIN_LINKS = [
  { href: "/gallery-add-item", label: "Gallery Add Item" },
  { href: "/gallery-alter-item", label: "Gallery Alter Item" },
  { href: "/video-upload-form", label: "Video Upload" },
  { href: "/video-update", label: "Alter Video" },
  { href: "/upload-inspirations", label: "Promote Upload" },
  { href: "/alter-inspirations", label: "Promote Alter" },
];

const SOCIALS = [
  {
    href: "https://www.facebook.com/Stoneartcity",
    Icon: FacebookIcon,
    className: "text-blue-500",
  },
  {
    href: "https://www.instagram.com/cornerstone_in_th3_spirit",
    Icon: InstagramIcon,
    className: "text-purple-500",
  },
  {
    href: "https://www.tiktok.com/@stoneartcity",
    Icon: TikTokIcon,
    className: "text-teal-700",
  },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive
          ? "text-primary underline underline-offset-4"
          : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/LogoNav.PNG"
              alt="Joshes Art Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </motion.div>
        </Link>

        {user && (
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="secondary" size="sm" className="gap-1" />
                  }
                >
                  Admin Actions <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {ADMIN_LINKS.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      render={<Link href={link.href} />}
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ href, Icon, className }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ rotate: [0, -10, 10, -6, 6, 0] }}
                  transition={{ duration: 0.5 }}
                  className={className}
                >
                  <Icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>

            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </nav>
        )}

        {!user && (
          <nav className="hidden items-center gap-4 md:flex">
            <NavLink href="/register" label="Register" />
            <NavLink href="/login" label="Login" />
          </nav>
        )}

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" />}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-4 pt-10">
            {user ? (
              <>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin &&
                  ADMIN_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
