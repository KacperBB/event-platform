"use client";

import { updateDescription } from '@/actions/settings';
import React, { useState, useTransition } from 'react'
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { maxLength } from 'zod';

interface DescriptionFormProps {
  initialDescription?: string | null;
}

const HandleDescription = ({ initialDescription }: DescriptionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState(initialDescription || "");

  const maxLength = 200;

  const onSubmit = (formData: FormData) => {
    const newDescription = formData.get("Description") as string;

    startTransition(async () => {
      const result = await updateDescription(newDescription);

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
        <p className="text-sm font-medium">Twój Opis</p>
        <div className="flex gap-x-2">
        <p className={`text-xs ${description.length >= maxLength ? "text-red-500" : "text-muted-foreground"}`}>
            {description.length}/{maxLength}
          </p>
          <Textarea
            name="Description"
            value={description}
            disabled={isPending}
            onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
            defaultValue={initialDescription || ""}
            placeholder="Opowiedz coś o sobie..."
            className='resize-none'
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default HandleDescription