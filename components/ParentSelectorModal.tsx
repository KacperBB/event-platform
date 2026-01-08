"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface ParentSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  parents: any[];
}

export const ParentSelectorModal = ({
  value,
  onChange,
  parents,
}: ParentSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedParent = parents.find((p) => p.id === value);
  const filteredParents = parents.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-auto py-3 px-4 rounded-xl border-dashed border-2 hover:border-sky-500 transition-all"
        >
          {selectedParent ? (
            <div className="flex flex-col items-start text-left">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Wybrany rodzic:
              </span>
              <span className="font-semibold text-sky-600">
                {selectedParent.title}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">
              Wybierz wydarzenie nadrzędne...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle>Wybierz wydarzenie nadrzędne</DialogTitle>
        </DialogHeader>
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj po nazwie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-xl font-normal text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Brak (ustaw jako główne)
          </Button>

          {filteredParents.map((parent) => (
            <div
              key={parent.id}
              onClick={() => {
                onChange(parent.id);
                setOpen(false);
              }}
              className={cn(
                "flex items-center p-3 rounded-xl cursor-pointer border transition-all hover:bg-slate-50",
                value === parent.id
                  ? "border-sky-500 bg-sky-50"
                  : "border-transparent",
              )}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{parent.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {parent.date
                    ? format(new Date(parent.date), "PPP", { locale: pl })
                    : "Brak daty"}
                </div>
              </div>
              {value === parent.id && (
                <Check className="h-4 w-4 text-sky-600" />
              )}
            </div>
          ))}
          {filteredParents.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">
              Nie znaleziono wydarzeń.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
