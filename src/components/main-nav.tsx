import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Heart,
  LayoutGrid,
  Moon,
  Users,
  HandCoins,
} from 'lucide-react';

const prayComponents: { title: string; href: string; description: string; icon: any }[] = [
  {
    title: "Daily Prayers",
    href: "/prayers",
    description: "Track and perform your daily prayers with precise timings and Qibla direction.",
    icon: HandCoins,
  },
  {
    title: "Quran Library",
    href: "/quran",
    description: "Read, listen, and study the Holy Quran with multiple translations and audio.",
    icon: BookOpen,
  },
  {
    title: "Du'a Collection",
    href: "/duas",
    description: "Comprehensive collection of authentic Du'as from Quran and Sunnah.",
    icon: Heart,
  },
  {
    title: "Dhikr & Meditation",
    href: "/dhikr",
    description: "Track your daily Dhikr and Islamic meditation practices.",
    icon: Moon,
  },
];

const learnComponents: { title: string; href: string; description: string; icon: any }[] = [
  {
    title: "Prayer Guide",
    href: "/learn/prayer",
    description: "Step-by-step guide to perfect your prayers with visual demonstrations.",
    icon: GraduationCap,
  },
  {
    title: "Quran Learning",
    href: "/learn/quran",
    description: "Learn to read and understand the Quran with tajweed rules.",
    icon: BookOpen,
  },
  {
    title: "Islamic Calendar",
    href: "/calendar",
    description: "Keep track of Islamic dates, events, and important occasions.",
    icon: Calendar,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Track your progress and manage your learning journey.",
    icon: LayoutGrid,
  },
];

export default function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9">
            <HandCoins className="mr-2 h-4 w-4" />
            Pray
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {prayComponents.map((component) => (
                <li key={component.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={component.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <component.icon className="h-4 w-4" />
                        {component.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {component.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9">
            <GraduationCap className="mr-2 h-4 w-4" />
            Learn
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
              {learnComponents.map((component) => (
                <li key={component.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={component.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <component.icon className="h-4 w-4" />
                        {component.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {component.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link
            to="/community"
            className={cn(
              "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            Community
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}