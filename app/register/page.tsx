import { redirect } from "next/navigation";

// /register → redirect করবে /auth/register এ
export default function RegisterRedirect() {
  redirect("/auth/register");
}
