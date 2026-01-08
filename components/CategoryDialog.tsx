"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/create-category"; // Import akcji

const formSchema = z.object({
  name: z.string().min(2, "Minimum 2 znaki"),
  color: z.string().min(4).optional(),
});

export const CategoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", color: "#2563eb" }, // Domyślny niebieski
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const res = await createCategory(values);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Kategoria dodana!");
        setOpen(false);
        reset();
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 h-8">
          <Plus className="h-3 w-3" />
          Dodaj nową
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nową kategorię</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nazwa kategorii</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("name")}
                placeholder="np. Festiwal"
                className="pl-9"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Kolor odznaki</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                {...register("color")}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                {...register("color")}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Zapisz kategorię"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
