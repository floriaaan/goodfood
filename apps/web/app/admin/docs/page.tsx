"use client";
import { RedocStandalone } from "redoc";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/fetchAPI";
import { useAuth } from "@/hooks";

export default function Docs() {
  const { user, session } = useAuth();

  const { data: doc, isLoading } = useQuery({
    queryKey: ["docs"],
    queryFn: async () => {
      const res = await fetchAPI(`/docs`, session?.token);
      return await res.json();
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
