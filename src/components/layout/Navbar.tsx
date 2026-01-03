import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Shield } from "lucide-react";
import logo from "@/assets/JE_Techhub_logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { CartSheet } from "@/components/cart/CartSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Gadgets", path: "/gadgets" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="JE Tech Hub" 
              className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {isActive(link.path) && (
                  <span className="absolute inset-0 bg-primary rounded-lg -z-10 animate-scale-in" />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons, Theme Toggle & Cart */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user && <CartSheet />}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:border-primary/50 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="max-w-[100px] truncate font-medium">
                      {user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute left-0 top-1 w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : ''}`} />
              <span className={`absolute left-0 top-3 w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-5 w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-lg font-medium hover:bg-secondary"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 rounded-lg font-medium text-destructive hover:bg-secondary text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};