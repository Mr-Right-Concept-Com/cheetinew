import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string | null;
  subject: string;
  description: string | null;
  category: "general" | "billing" | "technical" | "sales" | "abuse";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "in_progress" | "resolved" | "closed";
  assigned_to: string | null;
  related_service_type: string | null;
  related_service_id: string | null;
  first_response_at: string | null;
  resolved_at: string | null;
  satisfaction_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff: boolean;
  is_internal: boolean;
  attachments: any | null;
  created_at: string;
}

export interface CreateTicketInput {
  subject: string;
  description?: string;
  category?: SupportTicket["category"];
  priority?: SupportTicket["priority"];
  related_service_type?: string;
  related_service_id?: string;
}

export interface CreateMessageInput {
  ticket_id: string;
  message: string;
  attachments?: any;
}

export const useSupportTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("support-tickets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ["support-tickets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user,
  });
};

export const useSupportTicket = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["support-ticket", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as SupportTicket;
    },
    enabled: !!user && !!id,
  });
};

export const useTicketMessages = (ticketId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription for messages
  useEffect(() => {
    if (!user || !ticketId) return;

    const channel = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ticket-messages", ticketId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, ticketId, queryClient]);

  return useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as TicketMessage[];
    },
    enabled: !!user && !!ticketId,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateTicketInput) => {
      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user!.id,
          subject: input.subject,
          description: input.description,
          category: input.category || "general",
          priority: input.priority || "medium",
          related_service_type: input.related_service_type,
          related_service_id: input.related_service_id,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;
      return data as SupportTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Support ticket created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateMessageInput) => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: input.ticket_id,
          user_id: user!.id,
          message: input.message,
          attachments: input.attachments,
          is_staff: false,
          is_internal: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TicketMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", data.ticket_id] });
      toast.success("Message sent!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
};

export const useCloseTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("support_tickets")
        .update({ 
          status: "closed",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as SupportTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Ticket closed successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to close ticket: ${error.message}`);
    },
  });
};

export const useRateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) => {
      const { data, error } = await supabase
        .from("support_tickets")
        .update({ satisfaction_rating: rating })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as SupportTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Thank you for your feedback!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit rating: ${error.message}`);
    },
  });
};

// Support stats for dashboard
export const useSupportStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["support-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("status, priority, created_at, first_response_at, resolved_at");

      if (error) throw error;

      const tickets = data as Pick<SupportTicket, "status" | "priority" | "created_at" | "first_response_at" | "resolved_at">[];

      // Calculate average response time
      const ticketsWithResponse = tickets.filter(t => t.first_response_at);
      const avgResponseTime = ticketsWithResponse.length > 0
        ? ticketsWithResponse.reduce((sum, t) => {
            const created = new Date(t.created_at).getTime();
            const responded = new Date(t.first_response_at!).getTime();
            return sum + (responded - created);
          }, 0) / ticketsWithResponse.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      return {
        total: tickets.length,
        open: tickets.filter(t => t.status === "open").length,
        pending: tickets.filter(t => t.status === "pending").length,
        inProgress: tickets.filter(t => t.status === "in_progress").length,
        resolved: tickets.filter(t => t.status === "resolved" || t.status === "closed").length,
        urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length,
        avgResponseTimeHours: Math.round(avgResponseTime * 10) / 10,
      };
    },
    enabled: !!user,
  });
};
