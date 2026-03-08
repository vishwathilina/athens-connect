import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useClubs } from "@/hooks/useClubs";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", "Academic", "Technology", "Arts", "Social", "Business", "Athletics"];

const ClubsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
        <Skeleton className="h-48 w-full" />
        <div className="p-5 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const Clubs = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: clubs = [], isLoading, error } = useClubs(activeCategory, search);

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
        {isLoading && <ClubsSkeleton />}

        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Failed to load clubs. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {clubs.map(club => (
              <Link to={`/clubs/${club.slug}`} key={club.id} className="group">
                <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary transition-colors">
                  <div className="relative h-48 overflow-hidden bg-secondary">
                    {club.logo_url ? (
                      <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-muted-foreground/20">
                        {club.name[0]}
                      </div>
                    )}
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
                      <span>{club.member_count} members</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !error && clubs.length === 0 && (
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
