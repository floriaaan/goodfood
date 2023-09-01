export const SolidButton = ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => {
  return (
    <button
      className={`inline-flex items-center justify-center w-full font-bold  focus:outline-none focus:ring-2 duration-200 uppercase text-sm gap-x-2 p-3 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
