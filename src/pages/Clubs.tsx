import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Users, Search } from "lucide-react";
import clubMeeting from "@/assets/club-meeting.jpg";
import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";

const clubs = [
  { id: 1, name: "Debate Society", category: "Academic", members: 120, image: event3, description: "Sharpen your argumentation and public speaking skills through competitive debate." },
  { id: 2, name: "Tech & Innovation Club", category: "Technology", members: 250, image: event2, description: "Build, hack, and innovate with like-minded tech enthusiasts on campus." },
  { id: 3, name: "Photography Club", category: "Arts", members: 85, image: event1, description: "Capture campus life through your lens. Workshops, photo walks, and exhibitions." },
  { id: 4, name: "Community Service Club", category: "Social", members: 180, image: clubMeeting, description: "Make a difference in the community through volunteer work and service projects." },
  { id: 5, name: "Music & Band Society", category: "Arts", members: 95, image: event1, description: "From jam sessions to campus concerts — express yourself through music." },
  { id: 6, name: "Entrepreneurship Club", category: "Business", members: 200, image: event2, description: "Launch your startup journey with mentorship, pitch nights, and networking." },
  { id: 7, name: "Environmental Club", category: "Social", members: 110, image: event1, description: "Advocate for sustainability and lead green initiatives across campus." },
  { id: 8, name: "Sports & Fitness Club", category: "Athletics", members: 300, image: clubMeeting, description: "Stay active with intramural sports, fitness challenges, and team events." },
  { id: 9, name: "Film & Media Club", category: "Arts", members: 75, image: event3, description: "Produce short films, documentaries, and explore the art of storytelling." },
];

const categories = ["All", "Academic", "Technology", "Arts", "Social", "Business", "Athletics"];

const Clubs = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = clubs.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">EXPLORE</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Discover All<br />University Clubs.
            </h1>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clubs..."
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

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map(club => (
            <Link to={`/clubs/${club.id}`} key={club.id} className="group">
              <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary transition-colors">
                <div className="relative h-48 overflow-hidden">
                  <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 tag-pill bg-background/90 backdrop-blur-sm text-xs">{club.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-lg text-foreground">{club.name}</h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{club.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{club.members} members</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No clubs found matching your criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Clubs;
