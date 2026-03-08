import { useEffect, useState, useCallback } from "react";
import { ArrowUpRight, MapPin, Calendar, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useStats, fmtCount } from "@/hooks/useStats";
import heroCampus from "@/assets/hero-campus.jpg";
import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import type { Event } from "../../../shared/types";

const FALLBACK_IMAGES = [heroCampus, event1, event2, event3];

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSeats(event: Event) {
  const remaining = event.total_seats - event.registered_count;
  if (remaining <= 0) return "Fully Booked";
  if (event.total_seats >= 9999) return "Open to all";
  return `${remaining} seats left`;
}

function formatAttendees(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(0)}k+`;
  return `${count}+`;
}

// ── Slide ──────────────────────────────────────────────────
function HeroSlide({ event, index, membersLabel, clubsLabel }: {
  event: Event;
  index: number;
  membersLabel: string;
  clubsLabel: string;
}) {
  const bgImage = event.banner_url ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <div className="relative w-full h-full">
      <img
        src={bgImage}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.45)] to-transparent" />

      {/* Floating info card — top left */}
      <div className="absolute top-8 left-8 bg-background/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hidden md:block animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium truncate max-w-[220px]">{event.location}</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formatDay(event.event_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formatSeats(event)}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="tag-pill bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {formatAttendees(event.registered_count)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatTime(event.event_date)}
          </div>
        </div>
      </div>

      {/* Main content — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              WELCOME TO ATHENS
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[hsl(var(--surface-dark-foreground))] leading-[1.05]">
              Take Your Campus<br />
              Life To The<br />
              Next Level.
            </h1>
            {/* Event title */}
            <p className="mt-5 text-lg md:text-xl font-semibold text-[hsl(var(--surface-dark-foreground))] truncate max-w-lg">
              {event.title}
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--surface-dark-foreground)/0.65)] max-w-md line-clamp-2">
              {event.description}
            </p>
            <Link
              to={`/events/${event.id}`}
              className="mt-5 inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              View Event <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Members pill */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="font-display font-bold text-lg text-[hsl(var(--surface-dark-foreground))]">{membersLabel} Members</p>
              <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.6)]">Across {clubsLabel} clubs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Fallback static slide (used when no events yet) ─────────
function StaticSlide({ membersLabel, clubsLabel }: { membersLabel: string; clubsLabel: string }) {
  return (
    <div className="relative w-full h-full">
      <img src={heroCampus} alt="University campus" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.4)] to-transparent" />
      <div className="absolute top-8 left-8 bg-background/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hidden md:block">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium">Campus Central, University Ave</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Saturday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Open to all</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="tag-pill bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">4k+</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> 12:00 AM
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              WELCOME TO ATHENS
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[hsl(var(--surface-dark-foreground))] leading-[1.05]">
              Take Your Campus<br />Life To The<br />Next Level.
            </h1>
            <p className="mt-4 text-sm md:text-base text-[hsl(var(--surface-dark-foreground)/0.7)] max-w-md">
              Discover and join the ultimate university club & event experience with expert tips, social connections, and professional networks.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="font-display font-bold text-lg text-[hsl(var(--surface-dark-foreground))]">{membersLabel} Members</p>
              <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.6)]">Across {clubsLabel} clubs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hero Section ───────────────────────────────────────────
const HeroSection = () => {
  const { data: events } = useEvents();
  const { data: stats } = useStats();
  const upcomingEvents = (events ?? []).filter((e) => e.status === "upcoming").slice(0, 5);

  const membersLabel = fmtCount(stats?.total_members);
  const clubsLabel   = fmtCount(stats?.active_clubs, '');

  const [current, setCurrent] = useState(0);
  const total = upcomingEvents.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

  // Auto-advance every 5 s
  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, total]);

  return (
    <section className="relative pt-20">
      <div className="relative h-[85vh] min-h-[600px] overflow-hidden rounded-b-[2rem] mx-4 md:mx-8">

        {total === 0 ? (
          <StaticSlide membersLabel={membersLabel} clubsLabel={clubsLabel} />
        ) : (
          <>
            {/* Slides — each absolutely positioned and shifted by 100% per index */}
            {upcomingEvents.map((event, i) => (
              <div
                key={event.id}
                className="absolute inset-0 transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${(i - current) * 100}%)` }}
              >
                <HeroSlide event={event} index={i} membersLabel={membersLabel} clubsLabel={clubsLabel} />
              </div>
            ))}

            {/* Prev / Next arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-background transition-colors"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-background transition-colors"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {total > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {upcomingEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 h-2 bg-primary"
                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
