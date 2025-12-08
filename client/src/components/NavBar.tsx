import { Link, useLocation } from "wouter";
import { Home, MessageCircle, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/swipe", icon: Home, label: "Discover" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center">
      <nav className="glass-panel pointer-events-auto rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
