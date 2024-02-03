import Link from "next/link";

export default function Register() {
  return (
    <>
      <h1>Register</h1>
      <Link href="/auth/login">Login</Link>
    </>
  );
}
