import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Inria_Serif } from "next/font/google";
import Image from "next/image";
import { MdOutlineStar } from "react-icons/md";

const inria_serif = Inria_Serif({ subsets: ["latin"], weight: ["400", "700"] });

export const RatingSection = () => {
  const { user } = useAuth();
  return (
    <section
      className={cn(
        "relative flex h-80 w-full items-center justify-center text-white",
        inria_serif.className,
      )}
    >
      <Image
        src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=40"
        alt="bg"
        width={2370}
        quality={40}
        height={1580}
        className="absolute inset-0 z-0 h-80 object-cover"
      />
      <div className="absolute left-0 top-0 h-full w-full bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-y-2">
        <h1 className="text-5xl font-bold">{user.first_name}</h1>
        <h2 className="text-2xl font-normal">{"Comment s'est passé votre repas mardi ?"}</h2>
        <hr className="my-4 w-24 border border-white" />
        <div className="inline-flex items-center gap-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative w-10">
              {/* <MdStar className="absolute hidden h-10 w-10 hover:block" /> */}
              <MdOutlineStar className="absolute block h-10 w-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
