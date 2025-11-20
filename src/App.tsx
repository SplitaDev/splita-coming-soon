import { useState, FormEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, Shield, Users, Zap, CheckCircle2, ArrowRight, Activity, 
  Lock, Calendar, Share2, Sparkles,
  UserPlus, Plus, Minus, Instagram, Linkedin, Twitter
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { fetchStats, submitWaitlist, submitVendor } from "@/lib/api";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { GridPattern } from "@/components/ui/grid-pattern";
import { AdminPanel } from "@/components/admin/AdminPanel";

// Updated animated text transitions
const animatedTexts = ["rent", "team dinner", "restaurants", "trips", "bills", "memberships", "hotels", "rideshares", "movies", 
  "concerts", "events", "game tickets", "gifts", "subscriptions", "charities", "loans", "rentals", "services", "much more"];

// User preferences
const userTypes = ["Student", "Friend Group", "Vendor", "Creator"];
const vibeModes = [
  { name: "Night Mode", color: "bg-slate-900" },
  { name: "Sea-Green Mode", color: "bg-[rgb(var(--primary))]" },
];

// Build updates
const buildUpdates = [
  "Prototype shipping to alpha users next week",
  "Stripe integration complete",
  "Mobile app beta starting soon",
  "Local businesses signing up daily",
  "Security audit passed",
];

// Security partners
const securityPartners = ["Stripe", "Plaid", "PCI DSS"];

// Animated background illustrations
function BackgroundIllustrations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute top-20 left-10 w-64 h-64" style={{ opacity: 0.15 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
          <polygon
            points="100,20 180,80 180,120 100,180 20,120 20,80"
            fill="none"
            stroke="rgb(var(--primary))"
            strokeWidth="3"
            className="animate-pulse"
          />
        </svg>
      </div>
      <div className="absolute top-40 right-20 w-48 h-48" style={{ opacity: 0.15 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full animate-float-slow">
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgb(var(--primary))" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}

// Animated hero text with typing animation and gradient
function AnimatedHeroText() {
  return (
    <AnimatedGradientText
      colorFrom="#02B7A0"
      colorTo="#02D4B8"
      speed={1}
      className="inline-block min-w-[200px] text-left"
    >
      <TypingAnimation
        words={animatedTexts}
        typeSpeed={100}
        deleteSpeed={50}
        pauseDelay={1500}
        loop={true}
        showCursor={true}
        blinkCursor={true}
        cursorStyle="line"
      />
    </AnimatedGradientText>
  );
}

// Interactive Split Calculator
interface Person {
  id: number;
  name: string;
  percentage: number;
  amount: number;
}

function SplitCalculator() {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "You", percentage: 25, amount: 0 },
    { id: 2, name: "Friend 1", percentage: 25, amount: 0 },
    { id: 3, name: "Friend 2", percentage: 25, amount: 0 },
    { id: 4, name: "Friend 3", percentage: 25, amount: 0 },
  ]);
  const [total] = useState(100);

  const updatePercentage = (id: number, delta: number) => {
    setPeople((prev: Person[]) => {
      const updated = prev.map((p: Person) => {
        if (p.id === id) {
          const newPercent = Math.round(Math.max(0, Math.min(100, p.percentage + delta)));
          return { ...p, percentage: newPercent, amount: (total * newPercent) / 100 };
        }
        return p;
      });
      
      // Normalize percentages
      const sum = updated.reduce((acc: number, p: Person) => acc + p.percentage, 0);
      if (sum !== 100) {
        const diff = 100 - sum;
        const firstOther = updated.find((p: Person) => p.id !== id);
        if (firstOther) {
          firstOther.percentage = Math.round(firstOther.percentage + diff);
          firstOther.amount = (total * firstOther.percentage) / 100;
        }
      }
      
      return updated;
    });
  };

  const handleSliderChange = (id: number, newValue: number) => {
    setPeople((prev: Person[]) => {
      const updated = prev.map((p: Person) => {
        if (p.id === id) {
          const clampedValue = Math.round(Math.max(0, Math.min(100, newValue)));
          return { ...p, percentage: clampedValue, amount: (total * clampedValue) / 100 };
        }
        return p;
      });
      
      // Normalize percentages to sum to 100
      const sum = updated.reduce((acc: number, p: Person) => acc + p.percentage, 0);
      if (sum !== 100) {
        const diff = 100 - sum;
        const firstOther = updated.find((p: Person) => p.id !== id);
        if (firstOther) {
          firstOther.percentage = Math.round(firstOther.percentage + diff);
          firstOther.amount = (total * firstOther.percentage) / 100;
        }
      }
      
      return updated;
    });
  };

  useEffect(() => {
    setPeople((prev: Person[]) =>
      prev.map((p: Person) => ({ ...p, amount: (total * p.percentage) / 100 }))
    );
  }, [total]);

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Try it live</h3>
        <div className="text-right">
          <p className="text-xs text-[rgb(var(--muted-foreground))]">Total</p>
          <p className="text-2xl font-bold text-[rgb(var(--primary))]">${total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {people.map((person: Person) => (
          <div key={person.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{person.name}</span>
              <span className="text-sm font-bold">${person.amount.toFixed(2)}</span>
            </div>
            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={person.percentage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSliderChange(person.id, Number(e.target.value))}
                className="w-full h-2 bg-[rgb(var(--muted))] rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(var(--primary)) 0%, 
                    rgb(var(--primary)) ${person.percentage}%, 
                    rgb(var(--muted)) ${person.percentage}%, 
                    rgb(var(--muted)) 100%)`
                }}
              />
              <style>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: rgb(var(--primary));
                  border: 2px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  transition: all 0.2s ease;
                }
                .slider::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 4px 8px rgba(2, 183, 160, 0.4);
                }
                .slider::-moz-range-thumb {
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: rgb(var(--primary));
                  border: 2px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  transition: all 0.2s ease;
                }
                .slider::-moz-range-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 4px 8px rgba(2, 183, 160, 0.4);
                }
              `}</style>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updatePercentage(person.id, -5)}
                  className="w-8 h-8 rounded-full border border-[rgb(var(--border))] flex items-center justify-center hover:bg-[rgb(var(--muted))] transition-colors"
                  aria-label="Decrease by 5%"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs w-12 text-center font-medium">{Math.round(person.percentage)}%</span>
                <button
                  onClick={() => updatePercentage(person.id, 5)}
                  className="w-8 h-8 rounded-full border border-[rgb(var(--border))] flex items-center justify-center hover:bg-[rgb(var(--muted))] transition-colors"
                  aria-label="Increase by 5%"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button
        onClick={() => {
          const newPerson = {
            id: people.length + 1,
            name: `Friend ${people.length}`,
            percentage: 0,
            amount: 0,
          };
          setPeople((prev: Person[]) => {
            const equalShare = Math.round(100 / (prev.length + 1));
            const remainder = 100 - (equalShare * (prev.length + 1));
            return [
              ...prev.map((p: Person, idx: number) => ({ 
                ...p, 
                percentage: equalShare + (idx === 0 ? remainder : 0), 
                amount: (total * (equalShare + (idx === 0 ? remainder : 0))) / 100 
              })), 
              { 
                ...newPerson, 
                percentage: equalShare, 
                amount: (total * equalShare) / 100 
              }
            ];
          });
        }}
        variant="outline"
        className="w-full mt-4"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Add person
      </Button>
    </div>
  );
}

// Social Identity Section
function SocialIdentity() {
  const [signups, setSignups] = useState(3424);
  const [cities, setCities] = useState(23);
  const [waitlist, setWaitlist] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial stats from database
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await fetchStats();
        setSignups(stats.signups);
        setWaitlist(stats.waitlist);
        setCities(stats.cities);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Stats will update automatically when API returns new values

  // Generate random avatars
  const avatars = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    initials: String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  }));

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">The fintech social club</h2>
        <p className="text-[rgb(var(--muted-foreground))]">Join thousands building the future of group payments</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4 text-center">
          {isLoading ? (
            <div className="h-8 w-16 bg-[rgb(var(--muted))] rounded animate-pulse mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-[rgb(var(--primary))] mb-1 tabular-nums">
              {signups.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-[rgb(var(--muted-foreground))]">Early signups</p>
        </div>
        <div className="glass-panel p-4 text-center">
          {isLoading ? (
            <div className="h-8 w-16 bg-[rgb(var(--muted))] rounded animate-pulse mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-[rgb(var(--primary))] mb-1 tabular-nums">
              {waitlist.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-[rgb(var(--muted-foreground))]">Waitlist</p>
        </div>
        <div className="glass-panel p-4 text-center">
          {isLoading ? (
            <div className="h-8 w-16 bg-[rgb(var(--muted))] rounded animate-pulse mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-[rgb(var(--primary))] mb-1 tabular-nums">
              {cities}+
            </p>
          )}
          <p className="text-xs text-[rgb(var(--muted-foreground))]">Cities</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">Early members</p>
        <div className="flex flex-wrap gap-2">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: avatar.color }}
            >
              {avatar.initials}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Dynamic Email Waitlist with Preferences
function WaitlistForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submittedUserType, setSubmittedUserType] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !userType) return;

    setIsSubmitting(true);
    
    // Submit to database
    const success = await submitWaitlist(email, userType, undefined);
    
    if (success) {
      setSubmittedEmail(email);
      setSubmittedUserType(userType);
      setIsSubmitted(true);
      setIsSubmitting(false);
      onSuccess();
      toast({
        title: "You're in!",
        description: "Check your email for updates",
      });
    } else {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted && selectedVibe) {
  return (
      <div className="glass-panel p-8 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-[rgb(var(--primary))] mx-auto animate-bounce" />
        <h3 className="text-2xl font-bold">Welcome to Splita!</h3>
        <p className="text-[rgb(var(--muted-foreground))]">We'll notify you when we launch</p>
            </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="glass-panel p-8 space-y-6">
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-[rgb(var(--primary))] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Pick your vibe</h3>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">Customize your Splita experience</p>
              </div>
        <div className="grid grid-cols-2 gap-4">
          {vibeModes.map((vibe) => (
            <button
              key={vibe.name}
              onClick={async () => {
                setSelectedVibe(vibe.name);
                // Update waitlist with vibe preference
                if (submittedEmail && submittedUserType) {
                  await submitWaitlist(submittedEmail, submittedUserType, vibe.name);
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedVibe === vibe.name
                  ? "border-[rgb(var(--primary))] bg-[rgba(2,183,160,0.1)]"
                  : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]"
              }`}
            >
              <div className={`w-full h-12 rounded mb-2 ${vibe.color}`} />
              <p className="text-sm font-medium">{vibe.name}</p>
            </button>
          ))}
        </div>
                </div>
    );
  }

  return (
    <div className="glass-panel p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Get early access</h2>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">Join the waitlist and be first to experience Splita</p>
              </div>

      <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>

        <div>
          <p className="text-sm font-medium mb-3">I am a...</p>
          <div className="grid grid-cols-2 gap-2">
            {userTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                  userType === type
                    ? "border-[rgb(var(--primary))] bg-[rgba(2,183,160,0.1)] text-[rgb(var(--primary))]"
                    : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

                    <Button 
                      type="submit" 
                      className="btn-gradient w-full"
          disabled={isSubmitting || !userType}
                    >
          {isSubmitting ? "Joining..." : "Join waitlist"}
          <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </div>
  );
}

// Vendor CTA Section
function VendorCTA() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [vendorEmail, setVendorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit to database and send email
    const success = await submitVendor(vendorEmail);
    
    if (success) {
      setIsSubmitting(false);
      setVendorEmail("");
      setIsExpanded(false);
      toast({
        title: "Thank you!",
        description: "We've sent you an email with more information",
      });
    } else {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Are you a local business?</h3>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">Instant collections, clean tracking</p>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="shrink-0"
        >
          {isExpanded ? "Close" : "Learn more"}
        </Button>
                </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input
            type="email"
            placeholder="Business email"
            value={vendorEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVendorEmail(e.target.value)}
            required
          />
          <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Get vendor access"}
          </Button>
        </form>
      )}
    </div>
  );
}

// Mini Story Scroll Section
function StorySection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "People need to split something",
      description: "Dinner, rent, groceries, events",
      icon: Users,
    },
    {
      title: "The group chat chaos",
      description: "Venmo requests, IOU tracking, who paid what?",
      icon: Activity,
    },
    {
      title: "Splita solves it instantly",
      description: "One link, everyone pays, done.",
      icon: Zap,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = Math.floor(entry.intersectionRatio * 3);
            setActiveStep(Math.min(step, 2));
          }
        });
      },
      { threshold: [0, 0.33, 0.66, 1] }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="space-y-8 py-12">
      <h2 className="text-3xl font-bold text-center">How it works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className={`glass-panel p-6 text-center transition-all duration-500 ${
                activeStep >= index
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
                  activeStep >= index
                    ? "bg-[rgb(var(--primary))] scale-110"
                    : "bg-[rgb(var(--muted))]"
                }`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">{step.description}</p>
                  </div>
          );
        })}
                </div>
    </section>
  );
}

// Security & Trust Section
function SecuritySection() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Bank-level security</h2>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">Your payments are protected</p>
                  </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 text-center">
          <Lock className="w-8 h-8 text-[rgb(var(--primary))] mx-auto mb-2" />
          <p className="text-sm font-medium">Bank-level encryption</p>
                </div>
        <div className="glass-panel p-4 text-center">
          <Shield className="w-8 h-8 text-[rgb(var(--primary))] mx-auto mb-2" />
          <p className="text-sm font-medium">Secure payment flows</p>
                  </div>
        <div className="glass-panel p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-[rgb(var(--primary))] mx-auto mb-2" />
          <p className="text-sm font-medium">Compliance-ready</p>
                </div>
              </div>

      <div className="flex items-center justify-center gap-6 flex-wrap">
        {securityPartners.map((partner) => (
          <div key={partner} className="px-4 py-2 glass-panel text-sm font-medium">
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}

// Build Updates Feed
function BuildUpdates() {
  const [currentUpdate, setCurrentUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % buildUpdates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Follow our build</h2>
      <div className="glass-panel p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[rgb(var(--primary))] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-[rgb(var(--foreground))]">
              {buildUpdates[currentUpdate]}
            </p>
            <div className="flex gap-1 mt-3">
              {buildUpdates.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i === currentUpdate
                      ? "bg-[rgb(var(--primary))]"
                      : "bg-[rgb(var(--muted))]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Share Feature
function ShareFeature() {
  const handleShare = () => {
    const text = "Join me on Splita - the future of group payments!";
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: "Join Splita",
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
                <Button
      onClick={handleShare}
      variant="outline"
      className="w-full"
    >
      <Share2 className="w-4 h-4 mr-2" />
      Invite your group chat
                </Button>
  );
}

export default function App() {
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <Toaster />
      <BackgroundIllustrations />
      <GridPattern />
      <AdminPanel />
      <div className="app-shell min-h-screen relative" style={{ background: 'transparent' }}>
        <main className="app-content max-w-5xl mx-auto flex flex-col gap-16 py-12 md:py-24 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-0">
            <Logo size="2xl" className="max-w-[300px]" />
          </header>

          {/* 1. Bold Hero */}
          <section className="text-center space-y-6 -mt-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Split payments on
              <br />
              <AnimatedHeroText />
            </h1>
            <p className="text-lg text-[rgb(var(--muted-foreground))] max-w-2xl mx-auto">
              Splita turns messy group payments into a simple, fast, and reliable experience.
            </p>
          </section>

          {/* 2. Interactive Split Calculator */}
          <section>
            <SplitCalculator />
          </section>

          {/* 3. Waitlist Form - Moved above stats */}
          <section id="waitlist-section">
            <WaitlistForm onSuccess={() => setShowShare(true)} />
            {showShare && (
              <div className="mt-4">
                <ShareFeature />
              </div>
            )}
          </section>

          {/* 4. Social Identity */}
          <SocialIdentity />

          {/* 5. Vendor CTA */}
          <VendorCTA />

          {/* 6. Story Section */}
          <StorySection />

          {/* 7. Security Section */}
          <SecuritySection />

          {/* 8. Build Updates */}
          <BuildUpdates />

          {/* 9. Calendar Link */}
          <section className="glass-panel p-6 text-center space-y-4">
            <Calendar className="w-12 h-12 text-[rgb(var(--primary))] mx-auto" />
            <div>
              <h3 className="text-xl font-bold mb-2">Want to partner or test Splita?</h3>
              <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
                Book a 10-minute call with the founder
              </p>
              <Button
                onClick={() => window.open("https://cal.com/arinze-okigbo-bxrnea", "_blank")}
                className="btn-gradient"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a call
              </Button>
            </div>
          </section>

          {/* Social Links */}
          <section className="py-8">
            <div className="glass-panel p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Connect with us</h3>
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                <a
                  href="https://www.instagram.com/arinze.mov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[rgb(var(--foreground))] hover:text-[rgb(var(--primary))] transition-colors duration-300 glass-panel px-4 py-2 rounded-lg hover:scale-105"
                >
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/trysplita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[rgb(var(--foreground))] hover:text-[rgb(var(--primary))] transition-colors duration-300 glass-panel px-4 py-2 rounded-lg hover:scale-105"
                >
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://x.com/trysplita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[rgb(var(--foreground))] hover:text-[rgb(var(--primary))] transition-colors duration-300 glass-panel px-4 py-2 rounded-lg hover:scale-105"
                >
                  <Twitter className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-xs text-[rgb(var(--muted-foreground))] pt-8 pb-20 md:pb-4">
            Splita LLC. © {new Date().getFullYear()} • Coming Soon
          </footer>
          </main>

        {/* Sticky Bottom CTA for Mobile */}
        <div className="sticky-bottom-cta md:hidden">
          <Button
            onClick={() => {
              document.getElementById("waitlist-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-gradient w-full"
          >
            Join waitlist
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
}
