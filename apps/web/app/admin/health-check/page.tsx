"use client";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { fetchAPI } from "@/lib/fetchAPI";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 100);

      return () => {
        clearInterval(timer);
      };
    } else {
      setElapsedTime(0);
    }
  }, [isLoading]);

  return (
    <>
      <div className="flex flex-col">
        <h2 className="font-ultrabold inline-flex items-center bg-neutral-100 p-2 text-3xl uppercase lg:p-8">
          {"Etat de santé de l'application"}
        </h2>
        <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
          Services
        </h3>
        <div className="flex flex-col gap-4 p-2 lg:p-8">
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
            <div className="mx-auto flex w-full grow flex-col items-center justify-center">
              <div className="h-96 w-96">
                <LargeComponentLoader />
              </div>
              <p className="font-extrabold">
                Temps écoulé: <span className="w-10">{elapsedTime / 10}</span> secondes
              </p>
              <small>Temps max de réponse: 5 secondes</small>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
