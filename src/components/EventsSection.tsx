import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";

const events = [
  {
    date: "March 19-20, 2026",
    title: "Spring Festival 2026",
    description: "Experience the biggest campus celebration with live music, food stalls, club showcases, and exciting prizes.",
    location: "Campus Main Quad",
    start: "09:00 AM",
    end: "12:00 AM",
    images: [event1, event2],
    color: "bg-primary",
  },
  {
    date: "September 4-7, 2026",
    title: "Hackathon Week 2026",
    description: "Innovate and build with like-minded students. Workshops, mentorship, and prizes for top teams.",
    location: "Engineering Hall",
    start: "08:00 AM",
    end: "12:00 AM",
    images: [event2, event3],
    color: "bg-primary",
  },
];

const EventsSection = () => {
  return (
    <section id="events" className="surface-dark rounded-[2rem] mx-4 md:mx-8 my-8">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Campus Events — Don't Miss Out!
          </h2>
          <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)] max-w-2xl mx-auto">
            Explore events & unforgettable experiences with our upcoming events. Whether you're a seasoned pro or just starting your campus journey, we've got you covered.
          </p>
        </div>

        {/* Event Cards */}
        <div className="space-y-8">
          {events.map((event, i) => (
            <div key={i} className="border-t border-[hsl(var(--surface-dark-foreground)/0.15)] pt-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Info */}
                <div className="flex-1">
                  <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] mb-2">{event.date}</p>
                  <h3 className="font-display text-2xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)] mb-4 max-w-md">{event.description}</p>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--surface-dark-foreground)/0.5)]">
                      <Clock className="w-3.5 h-3.5" />
                      Start<br />{event.start}
                    </div>
                    <span className="tag-pill bg-primary text-primary-foreground text-xs border-none">Go</span>
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--surface-dark-foreground)/0.5)]">
                      End<br />{event.end}
                    </div>
                  </div>
                  <button className="btn-primary text-sm">
                    Join Now <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Images */}
                <div className="flex gap-3">
                  {event.images.map((img, j) => (
                    <img key={j} src={img} alt={`${event.title} ${j + 1}`} className="w-40 h-28 md:w-48 md:h-32 rounded-xl object-cover" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-right mt-8">
          <a href="#" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all events <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
