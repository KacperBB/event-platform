import Link from "next/link";
import { auth } from "@/auth";
import { UserButton } from "./auth/UserButton";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { CartSheet } from "./cart/CartSheet";

export const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="fixed top-0 w-full h-16 px-4 border-b bg-white/80 backdrop-blur-md z-50 flex items-center justify-between">
      <div className="flex items-center gap-x-8">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-primary"
        >
          Event<span className="text-sky-600">Platform</span>
        </Link>

        <div className="hidden md:flex items-center gap-x-4">
          <Link
            href="/events"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            Odkrywaj
          </Link>
          {session?.user?.role === "ORGANIZER" && (
            <Link
              href="/events/new"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition"
            >
              Moje Wydarzenia
            </Link>
          )}
        </div>
        <CartSheet />
      </div>

      <div className="flex items-center gap-x-4">
        {session ? (
          <>
            {session.user.role === "ORGANIZER" && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
              >
                <Link href="/events/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Stwórz event
                </Link>
              </Button>
            )}
            <UserButton user={session.user} />
          </>
        ) : (
          <div className="flex gap-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Zaloguj się</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">Dołącz</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
