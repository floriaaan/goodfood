import Image from "next/image";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <div className="flex min-w-[1/2] flex-1 flex-col justify-center px-4 shadow-lg sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {children}
      </div>
      <div className="relative hidden w-0 flex-1 dark:hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          layout="fill"
          src="/images/auth.jpg"
          alt="GuestBackground"
        />
        <div className="absolute inset-0 h-full w-full bg-black bg-opacity-80"></div>
      </div>
    </div>
  );
}
