import {
  USER_DASHBOARD,
  WEBSITE_LOGIN,
  WEBSITE_HOME,
} from "./Routes/WebsiteRoute";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { ADMIN_DASHBOARD } from "./Routes/AdminPanelRoute";

export default async function proxy(req) {
  try {
    const pathname = req.nextUrl.pathname;
    const hasToken = req.cookies.has("access_token");

    if (!hasToken) {
      // if the user is not logged in and try to access protected routes, redirect to login page.
      // if the user is logged in and try to access login page, redirect to home page.

      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
      }
      return NextResponse.next(); // Allow access to protected routes if not logged in
    }

    // verify the token
    const token = req.cookies.get("access_token");
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const role = payload.role;

    //  prevent logged in user from accessing auth routes

    if (pathname.startsWith("/auth") && !pathname.includes("/verify-email")) {
      return NextResponse.redirect(
        new URL(
          role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD,
          req.nextUrl
        )
      );
    }

    // protected admin routes

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
    }

    // protected user routes

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
  }
}

export const config = {
  matcher: ["/auth/:path*", "/admin/:path*", "/my-account/:path*"],
};