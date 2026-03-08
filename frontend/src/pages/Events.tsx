import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Clock, MapPin, Calendar, Search } from "lucide-react";
import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import clubMeeting from "@/assets/club-meeting.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";

const eventsData = [
  { id: 1, title: "Spring Festival 2026", date: "March 19-20, 2026", category: "Festival", location: "Campus Main Quad", start: "09:00 AM", end: "12:00 AM", image: event1, description: "Experience the biggest campus celebration with live music, food stalls, club showcases, and exciting prizes." },
  { id: 2, title: "Hackathon Week 2026", date: "April 4-7, 2026", category: "Technology", location: "Engineering Hall", start: "08:00 AM", end: "10:00 PM", image: event2, description: "Innovate and build with like-minded students. Workshops, mentorship, and prizes for top teams." },
  { id: 3, title: "Debate Championship", date: "April 15, 2026", category: "Academic", location: "Humanities Auditorium", start: "10:00 AM", end: "06:00 PM", image: event3, description: "Watch the best debaters compete in the annual inter-university championship." },
  { id: 4, title: "Club Fair 2026", date: "September 5, 2026", category: "Social", location: "Student Union Lawn", start: "11:00 AM", end: "04:00 PM", image: clubMeeting, description: "Discover 50+ clubs, meet current members, and sign up for your favorites all in one place." },
  { id: 5, title: "Music Night", date: "May 10, 2026", category: "Arts", location: "Performing Arts Center", start: "07:00 PM", end: "11:00 PM", image: event1, description: "An evening of live performances featuring student bands, solo artists, and surprise guest performers." },
  { id: 6, title: "Career Networking Mixer", date: "October 12, 2026", category: "Business", location: "Commerce Building Atrium", start: "05:00 PM", end: "08:00 PM", image: event2, description: "Connect with industry professionals, alumni, and fellow students at our annual career mixer." },
];

const categories = ["All", "Festival", "Technology", "Academic", "Social", "Arts", "Business"];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = eventsData.filter(e => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">UPCOMING</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Campus Events<br />& Happenings.
            </h1>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tag-pill text-sm transition-colors ${activeCategory === cat ? "bg-foreground text-background border-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-6 mb-16">
          {filtered.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} className="group block">
              <div className="flex flex-col md:flex-row gap-6 border border-border rounded-2xl p-5 hover:border-primary transition-colors">
                <div className="relative w-full md:w-64 h-44 rounded-xl overflow-hidden shrink-0">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 tag-pill bg-background/90 backdrop-blur-sm text-xs border-none">{event.category}</span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
                    <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.start} - {event.end}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
