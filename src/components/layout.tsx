import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import MainNav from './main-nav';
import MobileNav from './mobile-nav';
import UserNav from './user-nav';
import LanguageSwitcher from './language-switcher';
import { Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 w-11/12 mx-auto items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <span className="font-bold sm:inline-block">Inaamly</span>
            </Link>
            <MainNav />
          </div>
          <MobileNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <LanguageSwitcher />
            <UserNav />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className={cn('h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all', theme === 'dark' && 'rotate-90 scale-0')} />
              <Moon className={cn('absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all', theme === 'dark' && 'rotate-0 scale-100')} />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container w-11/12 py-10 mx-auto">
        {children}
      </main>
      <footer className="border-t">
        <div className="container max-w-screen-2xl py-6 w-11/12 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-muted-foreground hover:text-foreground">Our Mission</a></li>
                <li><a href="/team" className="text-muted-foreground hover:text-foreground">Team</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/quran" className="text-muted-foreground hover:text-foreground">Quran</a></li>
                <li><a href="/duas" className="text-muted-foreground hover:text-foreground">Du'as</a></li>
                <li><a href="/prayers" className="text-muted-foreground hover:text-foreground">Prayer Times</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="/forum" className="text-muted-foreground hover:text-foreground">Forum</a></li>
                <li><a href="/events" className="text-muted-foreground hover:text-foreground">Events</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Built with love for the Muslim Ummah © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}