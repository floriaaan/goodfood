import Image from "next/image";

export const CTA = () => {
  return (
    <section className="font-ultrabold relative flex h-64 w-full select-none items-center justify-center overflow-hidden text-white">
      <Image
        src={
          "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
        }
        alt="food image"
        className="overflow-hidden object-cover"
        width={1920}
        height={256}
      />
      <div className="absolute flex h-full w-full flex-col items-center justify-center gap-y-1">
        {/* <div className="w-fit rotate-2 border border-black bg-white px-2 py-1 text-3xl uppercase text-black">
          Découvre les meilleurs restaurants
        </div>
        <div className="w-fit -rotate-1 border border-black bg-white px-2 py-1 text-3xl uppercase text-black">
          de ta ville
        </div>
        <div className="w-fit rotate-[0.5deg] border border-white bg-black px-2 py-1 uppercase text-white">
          Ouverture le 1 juillet 2024
        </div> */}
        <div className="w-fit rotate-2 border border-black bg-white px-2 py-1 text-3xl uppercase leading-none text-black">
          Tu veux découvrir les
        </div>
        <div className="w-fit -rotate-1 border border-black bg-white px-2 py-1 text-3xl uppercase leading-none text-black">
          meilleurs restaurants de ta ville ?
        </div>
        <div className="mt-2 w-fit rotate-[0.75deg] border border-white bg-black px-2 py-1 uppercase leading-none text-white">
          Envoie GOODFOOD au 3615
        </div>
      </div>
    </section>
  );
};
