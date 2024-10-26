import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  Clock,
  Book,
  Heart,
  Moon,
  Home,
  Settings,
  LogOut,
  User,
  BookOpen,
  GraduationCap,
  Users,
  Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Daily Worship',
    items: [
      { name: 'Daily Prayers', href: '/prayers', icon: Clock },
      { name: 'Quran Library', href: '/quran', icon: BookOpen },
      { name: "Du'a Collection", href: '/duas', icon: Heart },
      { name: 'Dhikr & Meditation', href: '/dhikr', icon: Moon },
    ],
  },
  {
    title: 'Learn & Grow',
    items: [
      { name: 'Islamic Courses', href: '/course', icon: GraduationCap },
      { name: 'Knowledge Base', href: '/knowledge', icon: Book },
    ],
  },
  {
    title: 'Connect',
    items: [
      { name: 'Community', href: '/communities', icon: Users },
      // { name: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
];

interface NavLinkProps {
  href: string;
  icon: any;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, icon: Icon, children, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <SheetClose asChild>
      <Link
        to={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-lg",
          "hover:bg-accent/50 active:bg-accent",
          isActive && "bg-accent/50 font-medium text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="ml-auto w-1 h-4 bg-primary rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    </SheetClose>
  );
};

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="flex flex-col w-full sm:max-w-sm p-0"
      >
        <div className="flex items-center gap-2 p-4 border-b">
          <Link to="/" className="flex items-center gap-2 px-2">
            <div className="rounded-lg bg-primary/10 p-1">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Imaanly</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col gap-6 p-4">
            {menuItems.map((section, index) => (
              <div key={index} className="space-y-3">
                <h4 className="px-4 text-sm font-medium text-muted-foreground">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <NavLink
                      key={itemIndex}
                      href={item.href}
                      icon={item.icon}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* <div className="mt-auto border-t p-4">
          <div className="space-y-1">
            <NavLink href="/profile" icon={User}>
              Profile
            </NavLink>
            <NavLink href="/settings" icon={Settings}>
              Settings
            </NavLink>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}