import { LoginForm } from "@/app/auth/login/form";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>Login</h1>
      <LoginForm />
      <Link href="/auth/register">Register</Link>
    </div>
  );
}
