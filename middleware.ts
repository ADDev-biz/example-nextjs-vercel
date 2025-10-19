import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

// Simplified middleware - only handles authentication
// Role-based authorization is handled in individual page components
export default withAuth;

export const config = {
  matcher: ["/contact", "/dashboard", "/gcrhealth"],
};
