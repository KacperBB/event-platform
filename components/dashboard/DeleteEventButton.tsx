"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { cancelEvent } from "@/actions/cancel-event";

export const DeleteEventButton = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();

  const onCancel = () => {
    if (confirm("Czy na pewno chcesz odwołać to wydarzenie?")) {
      startTransition(async () => {
        try {
          const result = await cancelEvent(id);
          if (result?.error) {
            toast.error(result.error);
          } else if (result?.success) {
            toast.success(result.success);
          }
        } catch (e) {
          console.log(e);
          toast.error("Wystąpił krytyczny błąd połączenia.");
        }
      });
    }
  };

  return (
    <Button
      variant="desctuctive"
      size="sm"
      onClick={onCancel}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      <span className="ml-2">Usuń</span>
    </Button>
  );
};
