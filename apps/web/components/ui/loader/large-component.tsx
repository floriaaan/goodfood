export const LargeComponentLoader = () => {
  return (
    <div className="flex aspect-square h-auto w-full items-center justify-center">
      <video autoPlay loop muted className="h-64 w-64 object-cover">
        <source src="/videos/loader.webm" type="video/webm" />
      </video>
    </div>
  );
};
