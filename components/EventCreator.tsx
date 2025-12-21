import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCreatorProps {
  name: string | null;
  image: string | null;
  description: string | null;
}

export const EventCreator = ({ name, image, description }: EventCreatorProps) => {
  return (
    <div className="flex items-center gap-x-2 p-4 border rounded-lg bg-slate-50">
      <Avatar>
        <AvatarImage src={image || ""} />
        <AvatarFallback>
          {name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-xs text-muted-foreground">Organizator</p>
        <p className="text-sm font-semibold">{name || "Anonimowy użytkownik"}</p>
      </div>
      <p className="text-sm font-semibold">{description || " "}</p>
    </div>
  );
};