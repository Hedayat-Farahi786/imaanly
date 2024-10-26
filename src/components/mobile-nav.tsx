import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link to="/" className="flex items-center">
            <span className="font-bold">Salaam</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 mt-4">
          <div className="flex flex-col space-y-2">
            <h4 className="px-7 text-sm font-medium">Pray</h4>
            <Link to="/prayers" className="px-7 py-2 text-sm hover:bg-accent">Daily Prayers</Link>
            <Link to="/quran" className="px-7 py-2 text-sm hover:bg-accent">Quran Library</Link>
            <Link to="/duas" className="px-7 py-2 text-sm hover:bg-accent">Du'a Collection</Link>
            <Link to="/dhikr" className="px-7 py-2 text-sm hover:bg-accent">Dhikr & Meditation</Link>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="px-7 text-sm font-medium">Learn</h4>
            <Link to="/courses" className="px-7 py-2 text-sm hover:bg-accent">Courses</Link>
            <Link to="/articles" className="px-7 py-2 text-sm hover:bg-accent">Articles</Link>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="px-7 text-sm font-medium">Community</h4>
            <Link to="/community" className="px-7 py-2 text-sm hover:bg-accent">Join Community</Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}