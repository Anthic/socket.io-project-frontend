import { redirect } from "next/navigation";

// /login → redirect করবে /auth/login এ
export default function LoginRedirect() {
  redirect("/auth/login");
}
