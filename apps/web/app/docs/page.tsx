"use client";
import { RedocStandalone } from "redoc";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/fetchAPI";

export default function Docs() {
  const { data: doc, isLoading } = useQuery({
    queryKey: ["docs"],
    queryFn: async () => {
      const res = await fetchAPI(`/docs`);
      const body = await res.json();
      return body;
    },
  });

  if (isLoading) return "";

  return (
    <div>
      <RedocStandalone
        spec={doc}
        options={{
          nativeScrollbars: true,
          theme: { colors: { primary: { main: "#F99436" } } },
        }}
      />
    </div>
  );
}
