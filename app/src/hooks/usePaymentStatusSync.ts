import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { SessionDbRow } from "@/services/sessionService";

const POLLING_INTERVAL_MS = 5000;

export const usePaymentStatusSync = (enabled: boolean) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("consulta-status-pagamento")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "consulta" },
        (payload) => {
          const novo = payload.new as Partial<SessionDbRow>;
          const antigo = payload.old as Partial<SessionDbRow>;
          
          if (antigo.status_pagamento === undefined || novo.status_pagamento !== antigo.status_pagamento) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.ALL });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);
};

export const paymentPollingInterval = (sessions: SessionDbRow[] | undefined) =>
  sessions?.some((s) => s.status_pagamento === "Processando") ? POLLING_INTERVAL_MS : false;
