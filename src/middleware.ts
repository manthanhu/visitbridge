import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const adminRoutes = ["/admin"];
const onboardingRoute = "/onboarding";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isOnboardingRoute = pathname === onboardingRoute;

  if (!isAuthRoute && !isProtectedRoute && !isOnboardingRoute) {
    return NextResponse.next();
  }

  // Use native fetch to verify the session securely in the Edge runtime
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );
  
  const sessionData = await response.json().catch(() => null);
  const session = sessionData?.session;
  const user = sessionData?.user;

  // Unauthenticated users
  if (!session) {
    if (isProtectedRoute || isOnboardingRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // Authenticated users
  const isProfileComplete = user?.isProfileComplete === true;

  if (isAuthRoute) {
    // Redirect away from auth routes if already signed in
    if (isProfileComplete) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  if (isProtectedRoute && !isProfileComplete) {
    // Force incomplete profiles to onboarding
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (isOnboardingRoute && isProfileComplete) {
    // Prevent revisiting onboarding if profile is already complete
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  if (isAdminRoute && user?.role !== "ADMIN") {
    // Redirect non-admins to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
