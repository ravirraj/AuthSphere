import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  User, LogOut, LayoutDashboard, Settings,
  Menu, Shield, Zap, BookOpen, CreditCard, ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add shadow/border on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features", icon: Zap },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Documentation", href: "/docs", icon: BookOpen },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "border-b bg-white/80 backdrop-blur-md py-2"
        : "bg-transparent py-4"
      }`}>
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group outline-none">
          <div className="bg-blue-600 p-1.5 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
            <div className="w-5 h-5 border-2 border-white rounded-[4px]" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-slate-900 bg-clip-text">
            AuthSphere
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`hover:text-blue-600 transition-colors ${location.pathname === link.href ? "text-blue-600" : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-3">

          {loading ? (
            <div className="h-9 w-9 animate-pulse bg-slate-200 rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 flex items-center gap-2 pl-1 pr-2 rounded-full border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-all outline-none"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-white shadow-sm">
                      {user.picture ? (
                        <img src={user.picture} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-blue-100 text-blue-600 font-bold text-xs">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-slate-700">
                      {user.username}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60 mt-2 p-2 rounded-2xl shadow-xl border-slate-100">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-900">{user.username}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-2" />

                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg cursor-pointer py-2.5">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-slate-500" />
                    <span className="font-medium">Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg cursor-pointer py-2.5">
                    <Settings className="mr-3 h-4 w-4 text-slate-500" />
                    <span className="font-medium">Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/settings/sessions")} className="rounded-lg cursor-pointer py-2.5">
                    <Shield className="mr-3 h-4 w-4 text-slate-500" />
                    <span className="font-medium">Security</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="mx-2" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="font-bold text-slate-600">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-5 shadow-md shadow-blue-100 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* MOBILE MENU (SHEET) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <Menu className="h-5 w-5 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1 rounded-md">
                      <div className="w-4 h-4 border-2 border-white rounded-sm" />
                    </div>
                    AuthSphere
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-3 p-3 text-lg font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-blue-600" />
                      {link.name}
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                  {!user && (
                    <Link to="/login">
                      <Button variant="outline" className="w-full justify-start py-6 rounded-xl border-slate-200">
                        Log In
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;