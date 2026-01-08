"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateHandle } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HandleFormProps {
  initialHandle?: string | null;
}

export const HandleForm = ({ initialHandle }: HandleFormProps) => {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    const newHandle = formData.get("handle") as string;

    startTransition(async () => {
      const result = await updateHandle(newHandle);

      if (result?.error) {
        toast.error(result.error);
      }

      if (result?.success) {
        toast.success(result.success);
      }
    });
  };

  return (
    <form action={onSubmit} className="flex flex-col gap-y-4 max-w-[400px]">
      <div className="space-y-2">
        <p className="text-sm font-medium">Twój handle</p>
        <div className="flex gap-x-2">
          <Input
            name="handle"
            disabled={isPending}
            defaultValue={initialHandle || ""}
            placeholder={initialHandle}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default HandleForm;
