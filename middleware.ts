import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the request is for /gcrhealth - do role check
  if (request.nextUrl.pathname === "/gcrhealth") {
    try {
      const { isAuthenticated, getRoles, getClaim } = getKindeServerSession(request);

      // Check if user is authenticated
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        const loginUrl = new URL("/api/auth/login", request.url);
        loginUrl.searchParams.set("post_login_redirect_url", request.url);
        return NextResponse.redirect(loginUrl);
      }

      // Get user roles
      const roles = await getRoles();
      const rolesClaim = await getClaim("roles");

      // Check if user has the POC-Admin role with key zz-addev-role-admin
      let hasAdminRole = false;

      if (roles && Array.isArray(roles)) {
        hasAdminRole = roles.some((role: any) => role.key === "zz-addev-role-admin");
      } else if (rolesClaim && rolesClaim.value) {
        const rolesArray = Array.isArray(rolesClaim.value) ? rolesClaim.value : [rolesClaim.value];
        hasAdminRole = rolesArray.some((role: any) =>
          role === "zz-addev-role-admin" ||
          role.key === "zz-addev-role-admin" ||
          (typeof role === 'object' && (role.key === "zz-addev-role-admin" || role.name === "POC-Admin"))
        );
      }

      if (!hasAdminRole) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Error checking role:", error);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // For other routes, use standard auth middleware
  const authResponse = await withAuth(request);
  if (authResponse) {
    return authResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contact", "/dashboard", "/gcrhealth"],
};

export default middleware;
