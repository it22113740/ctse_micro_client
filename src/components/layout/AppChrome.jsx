"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import AdminFooter from "./AdminFooter";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { AuthProvider, useAuth } from "../../context/AuthContext";

const protectedUserRoutes = ["/bookings", "/reviews", "/profile"];
const guestOnlyRoutes = ["/login", "/signup"];

function AppChromeContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = pathname?.startsWith("/admin");
  const isProtectedUserRoute = protectedUserRoutes.some((route) =>
    pathname?.startsWith(route)
  );
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    if (isAdmin || isLoading) {
      return;
    }

    if (!isAuthenticated && isProtectedUserRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isGuestOnlyRoute) {
      router.replace("/profile");
    }
  }, [
    isAdmin,
    isAuthenticated,
    isGuestOnlyRoute,
    isLoading,
    isProtectedUserRoute,
    router,
  ]);

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      <main className="flex-1">{children}</main>
      {isAdmin ? <AdminFooter /> : <Footer />}
    </>
  );
}

export default function AppChrome({ children }) {
  return (
    <AuthProvider>
      <AppChromeContent>{children}</AppChromeContent>
    </AuthProvider>
  );
}
