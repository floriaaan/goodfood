"use client";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { fetchAPI } from "@/lib/fetchAPI";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircleIcon } from "lucide-react";

export default function HealthCheckPage() {
  const { data: health_check, isLoading } = useQuery<
    Record<
      string,
      {
        responseTime: number;
        ok: boolean;
      }
    >
  >({
    queryKey: ["health_check"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/health-check`);
      const body = await res.json();
      return body;
    },
    staleTime: 1000 * 10, // 10 seconds,
    refetchInterval: 1000 * 10,
  });

  return (
    <>
      <div className="flex max-h-screen w-full grow flex-col gap-3 px-6 pb-6 pt-8">
        <h2 className="text-xl font-semibold">{"État de l'application"}</h2>

        <h4 className="text-lg font-semibold">{"Services"}</h4>
        {!isLoading ? (
          <div className="grid w-full grid-cols-2 gap-4">
            {Object.entries(health_check ?? {}).map(([name, { ok, responseTime }]) => (
              <div
                key={name}
                className="inline-flex items-center justify-between gap-1 border border-gray-200 p-4 text-gray-600"
              >
                <div className="flex justify-between">
                  <span className="font-semibold first-letter:uppercase">{name.replace("Service", "")}</span>
                </div>
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-bold">{responseTime} ms</span>
                  {ok ? (
                    <span className="text-green-500">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="text-red-500">
                      <XCircleIcon className="h-5 w-5" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LargeComponentLoader />
        )}
      </div>
    </>
  );
}