import MosqueFinder from "@/components/mosque-finder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VerseCarousel from "@/components/verse-carousel";
import { prayerService } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Book,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Enhanced testimonials data
const testimonials = [
  {
    name: "Ahmed",
    location: "United States",
    quote:
      "This app has transformed my daily spiritual routine. The prayer tracking keeps me accountable.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Fatima",
    location: "United Kingdom",
    quote:
      "The Quran features and daily reminders have helped me connect more deeply with my faith.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Omar",
    location: "Canada",
    quote:
      "Perfect for busy professionals! The prayer notifications and nearby mosque finder are invaluable.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Sarah",
    location: "Australia",
    quote:
      "The Quran learning features have made it easier for my children to learn and understand Islam.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Yusuf",
    location: "Germany",
    quote:
      "The community features help me stay connected with fellow Muslims worldwide.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Aisha",
    location: "Malaysia",
    quote:
      "Beautiful app with accurate prayer times and helpful reminders. Exactly what I needed!",
    rating: 5,
    avatar: "/api/placeholder/40/40",
  },
];

// Enhanced core features with links
const features = [
  {
    icon: Book,
    title: "Learn Quran",
    description:
      "Read, listen, and understand the Holy Quran with translations and tafsir",
    link: "/quran",
  },
  {
    icon: Clock,
    title: "Prayer Guidance",
    description: "Accurate prayer times and guidance for your location",
    link: "/prayers",
  },
  {
    icon: Heart,
    title: "Daily Dhikr",
    description: "Track your daily remembrance and spiritual practices",
    link: "/dhikr",
  },
  {
    icon: GraduationCap,
    title: "Islamic Learning",
    description: "Access comprehensive Islamic knowledge and courses",
    link: "/learn",
  },
];

const defaultPrayers = [
  {
    id: "fajr",
    name: "Fajr",
    time: "05:30",
    completed: false,
    isPassed: false,
    isNext: true,
  },
  {
    id: "dhuhr",
    name: "Dhuhr",
    time: "13:00",
    completed: false,
    isPassed: false,
    isNext: false,
  },
  {
    id: "asr",
    name: "Asr",
    time: "16:30",
    completed: false,
    isPassed: false,
    isNext: false,
  },
  {
    id: "maghrib",
    name: "Maghrib",
    time: "19:45",
    completed: false,
    isPassed: false,
    isNext: false,
  },
  {
    id: "isha",
    name: "Isha",
    time: "21:15",
    completed: false,
    isPassed: false,
    isNext: false,
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Track Spiritual Growth",
    description: "Monitor your progress in prayers, Quran reading, and daily adhkar"
  },
  {
    icon: Book,
    title: "Build Knowledge",
    description: "Learn from authentic sources and qualified scholars"
  },
  {
    icon: Users,
    title: "Join Community",
    description: "Connect with a global community of Muslims"
  }
];

function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isFriday, setIsFriday] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);


  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2); // Tablet
      } else {
        setSlidesPerView(3); // Desktop
      }
    };
  
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);


  // Check if it's Friday
  useEffect(() => {
    const today = new Date();
    setIsFriday(today.getDay() === 5);
  }, []);


  const { data: prayerTimes, isLoading } = useQuery({
    queryKey: ["prayerTimes"],
    queryFn: async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return await prayerService.getTimes(
          position.coords.latitude,
          position.coords.longitude
        );
      } catch (error) {
        console.error("Error:", error);
        toast.error("Using estimated prayer times");
        return defaultPrayers;
      }
    },
    retry: 1,
  });

  const copyHadith = async () => {
    const hadithText =
      "The best among you are those who learn the Quran and teach it. - Sahih Al-Bukhari";
    await navigator.clipboard.writeText(hadithText);
    toast.success("Hadith copied to clipboard");
  };

  // Auto-advance testimonials
  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  }, []);
  
  const previousTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

{/* Update the auto-advance effect */}
useEffect(() => {
  const timer = setInterval(() => {
    setTestimonialIndex(prev => 
      (prev + 1) % Math.ceil(testimonials.length / slidesPerView)
    );
  }, 5000);
  return () => clearInterval(timer);
}, [slidesPerView]);

  return (
    <div className="space-y-16 pb-16 w-full">
      {/* Hero Section with Animation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 text-center"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)" }}
        />
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
          >
            Your Guide to Islamic Knowledge and Practice
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground"
          >
            Strengthen your connection with Allah through guided prayers, daily
            remembrance, and continuous learning
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Book className="h-5 w-5" />
              Explore Quran
            </Button>
          </motion.div>
        </div>
      </motion.section>

           {/* Verse Carousel */}
           <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container"
      >
        <VerseCarousel />
      </motion.section>

      {/* Core Features with Animation */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What you can do with Imaanly</h2>
          <p className="text-muted-foreground">
            Everything you need for your spiritual journey
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {features.map((feature, index) => (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg group relative">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <feature.icon className="h-6 w-6 text-primary" />
            <CardTitle>{feature.title}</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground pb-5">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="absolute bottom-0 right-0 p-4">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="group hover:bg-transparent hover:text-primary p-0"
          >
            <Link to={feature.link} className="flex items-center gap-2">
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
      </motion.section>

 

     


      {/* Prayer Times and Inspiration */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container grid gap-6 md:grid-cols-2"
      >
        {/* Prayer Times Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Prayer Times</CardTitle>
                <CardDescription>Today's prayer schedule</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Find Mosques
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Nearby Mosques</DialogTitle>
                    <DialogDescription>
                      Find mosques in your area
                    </DialogDescription>
                  </DialogHeader>
                  <MosqueFinder />
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 p-3 bg-secondary/20 dark:bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Local prayer times for your location
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {(prayerTimes ?? defaultPrayers).map((prayer) => (
                <motion.div
                  key={prayer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    prayer.isNext &&
                      "bg-primary/5 dark:bg-primary/10 scale-[1.02]",
                    prayer.isPassed && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        prayer.isNext
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "bg-secondary/20 dark:bg-secondary/10"
                      )}
                    >
                      <Clock
                        className={cn(
                          "h-4 w-4",
                          prayer.isNext && "text-primary dark:text-primary"
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{prayer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {prayer.time}
                      </p>
                    </div>
                  </div>
                  {prayer.isNext && (
                    <span className="text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Next Prayer
                    </span>
                  )}
                </motion.div>
              ))}

              {isFriday && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-primary/5 dark:bg-primary/10 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Jumu'ah Prayer</p>
                      <p className="text-sm text-muted-foreground">13:30</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-full">
                    Friday Prayer
                  </span>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Inspiration and Community */}
        <div className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Star className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Daily Inspiration</CardTitle>
              <CardDescription>
                Hadith of the day and spiritual reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="border-l-2 pl-4 italic">
                "The best among you are those who learn the Quran and teach it."
                <footer className="text-sm text-muted-foreground mt-2">
                  - Sahih Al-Bukhari
                </footer>
              </blockquote>
              <Button
                variant="outline"
                className="w-full gap-2 group"
                onClick={copyHadith}
              >
                <Copy className="h-4 w-4 transition-transform group-hover:scale-110" />
                Copy Hadith
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg overflow-hidden">
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Islamic Calendar Highlights</CardTitle>
              <CardDescription>
                Upcoming Islamic events and important dates
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-background dark:bg-background/80 p-3 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Ramadan</p>
                      <p className="text-sm text-muted-foreground">
                        Begins in 45 days
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background dark:bg-background/80 rounded-lg p-4 space-y-1">
                      <p className="font-medium">Laylat al-Qadr</p>
                      <p className="text-sm text-muted-foreground">
                        27th Night
                      </p>
                    </div>
                    <div className="bg-background dark:bg-background/80 rounded-lg p-4 space-y-1">
                      <p className="font-medium">Eid ul-Fitr</p>
                      <p className="text-sm text-muted-foreground">
                        1st Shawwal
                      </p>
                    </div>
                  </div>
                  <Button className="w-full gap-2 group">
                    View Islamic Calendar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Enhanced Testimonials Carousel */}

      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our App</h2>
          <p className="text-muted-foreground">
            Enhance your spiritual journey with powerful features
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="transition-colors hover:bg-accent">
              <CardHeader>
                <benefit.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>



      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-none">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-foreground">
              Begin Your Spiritual Journey Today
            </h2>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our global community and strengthen your connection with
              Allah through guided prayers, daily remembrance, and continuous
              learning.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 group">
                <Sparkles className="h-5 w-5" />
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-background/50 dark:bg-background/20"
              >
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>



{/* Fixed Testimonials Section */}
{/* <motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  className="container px-4 md:px-6"
>
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold mb-4">Our Community</h2>
    <p className="text-muted-foreground">
      Join thousands of Muslims worldwide on their spiritual journey
    </p>
  </div>

  <div className="relative">
    <div className="overflow-hidden">
      <motion.div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${testimonialIndex * 100}%)`,
          width: `${testimonials.length * 100}%`,
          display: 'flex',
        }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            style={{ width: `${100 / testimonials.length}%` }}
            className="min-w-full px-4 sm:min-w-[50%] lg:min-w-[33.333%]"
          >
            <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-zinc-800/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="italic text-muted-foreground line-clamp-4">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </motion.div>
    </div>

    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={previousTestimonial}
        className="rounded-full bg-background/80 dark:bg-background/20 backdrop-blur-sm pointer-events-auto"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextTestimonial}
        className="rounded-full bg-background/80 dark:bg-background/20 backdrop-blur-sm pointer-events-auto"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>

    <div className="flex justify-center gap-2 mt-6">
      {testimonials.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setTestimonialIndex(idx)}
          className={cn(
            "h-2 rounded-full transition-all",
            testimonialIndex === idx 
              ? "w-8 bg-primary" 
              : "w-2 bg-primary/20"
          )}
        />
      ))}
    </div>
  </div>
</motion.section> */}
    </div>
  );
}

export default Home;
