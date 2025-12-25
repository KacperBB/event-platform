import React from "react";
import { Button } from "../ui/button";
import { Edit, Link } from "lucide-react";

const OrganizerPanel = () => {
  return (
    <Button variant="outline" size="icon" asChild>
      <Link href={`/events/${event.id}/edit`}>
        <Edit className="w-4 h-4" />
      </Link>
    </Button>
  );
};

export default OrganizerPanel;
