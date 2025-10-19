import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import GcrHealthClient from "./GcrHealthClient";

// Server component - handles role-based authorization
export default async function GcrHealthPage() {
  const { isAuthenticated, getRoles, getClaim } = getKindeServerSession();

  // Check if user is authenticated
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/gcrhealth");
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
    redirect("/unauthorized");
  }

  // If authenticated and has admin role, render the client component
  return <GcrHealthClient />;
}
