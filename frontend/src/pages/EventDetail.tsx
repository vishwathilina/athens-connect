import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Clock, MapPin, Calendar, Users, ArrowLeft, Share2 } from "lucide-react";
import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import clubMeeting from "@/assets/club-meeting.jpg";
import { useParams, Link } from "react-router-dom";

const eventsData = [
  { id: 1, title: "Spring Festival 2026", date: "March 19-20, 2026", category: "Festival", location: "Campus Main Quad", start: "09:00 AM", end: "12:00 AM", image: event1, description: "Experience the biggest campus celebration with live music, food stalls, club showcases, and exciting prizes.", longDescription: "The Spring Festival is our flagship annual event bringing together the entire university community. Over two days, enjoy live performances from student bands and guest artists, browse 30+ food stalls featuring cuisines from around the world, and discover new clubs at our showcase area. Highlights include the talent show finals, outdoor movie screening, and the legendary closing night fireworks. Last year, over 5,000 students attended — this year, we're going even bigger.", attendees: 3200, organizer: "Student Union" },
  { id: 2, title: "Hackathon Week 2026", date: "April 4-7, 2026", category: "Technology", location: "Engineering Hall", start: "08:00 AM", end: "10:00 PM", image: event2, description: "Innovate and build with like-minded students.", longDescription: "Hackathon Week is a 4-day innovation marathon where teams of 2-5 students build solutions to real-world challenges. With tracks in AI, sustainability, health tech, and social impact, there's something for everyone. Industry mentors from top tech companies provide guidance, and prizes include internship opportunities, cash awards, and incubator access. No coding experience required — we have beginner-friendly tracks too!", attendees: 800, organizer: "Tech & Innovation Club" },
  { id: 3, title: "Debate Championship", date: "April 15, 2026", category: "Academic", location: "Humanities Auditorium", start: "10:00 AM", end: "06:00 PM", image: event3, description: "Watch the best debaters compete.", longDescription: "The Annual Debate Championship brings together the top university debate teams from across the region. Watch as skilled orators tackle pressing global issues in a structured competitive format. The event features preliminary rounds, semifinals, and a thrilling grand finale judged by renowned academics and public figures.", attendees: 500, organizer: "Debate Society" },
  { id: 4, title: "Club Fair 2026", date: "September 5, 2026", category: "Social", location: "Student Union Lawn", start: "11:00 AM", end: "04:00 PM", image: clubMeeting, description: "Discover 50+ clubs and sign up.", longDescription: "The Club Fair is the ultimate gateway to campus life. Over 50 clubs set up interactive booths where you can meet current members, watch demonstrations, and sign up on the spot. From academic societies to athletic teams, arts collectives to social impact organizations — find your community. Free food, live music, and giveaways make it a day you won't want to miss.", attendees: 4000, organizer: "Student Affairs Office" },
  { id: 5, title: "Music Night", date: "May 10, 2026", category: "Arts", location: "Performing Arts Center", start: "07:00 PM", end: "11:00 PM", image: event1, description: "An evening of live performances.", longDescription: "Music Night showcases the incredible musical talent on our campus. From solo acoustic sets to full band performances, jazz to rock, classical to hip-hop — the evening celebrates diversity in sound. Past events have featured surprise appearances by professional artists, and this year promises to be the most spectacular yet.", attendees: 1200, organizer: "Music & Band Society" },
  { id: 6, title: "Career Networking Mixer", date: "October 12, 2026", category: "Business", location: "Commerce Building Atrium", start: "05:00 PM", end: "08:00 PM", image: event2, description: "Connect with industry professionals.", longDescription: "The Career Networking Mixer connects students with industry leaders, successful alumni, and recruiters from top companies. Enjoy an evening of structured networking sessions, panel discussions on career trends, and one-on-one mentorship opportunities. Professional attire recommended. Past attendees have secured internships and full-time positions through connections made at this event.", attendees: 600, organizer: "Entrepreneurship Club" },
];

const EventDetail = () => {
  const { id } = useParams();
  const event = eventsData.find(e => e.id === Number(id));

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-padding max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Link to="/events" className="btn-primary text-sm">Back to Events</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-[28rem] mb-10">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.3)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <span className="tag-pill bg-primary text-primary-foreground text-xs border-none mb-4 inline-block">{event.category}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-[hsl(var(--surface-dark-foreground))] mb-2">{event.title}</h1>
            <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.7)]">{event.date}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Event</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{event.longDescription}</p>

            <h3 className="font-display text-xl font-bold text-foreground mb-4">What To Expect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Engaging Activities", "Networking Opportunities", "Free Refreshments", "Exclusive Giveaways", "Expert Speakers", "Community Building"].map(item => (
                <div key={item} className="flex items-center gap-3 bg-secondary rounded-xl p-4">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <div className="bg-secondary rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-2xl text-foreground">{event.attendees?.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">people attending</p>
              <button className="btn-primary w-full justify-center text-sm mb-3">
                RSVP Now <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="btn-outline-dark w-full justify-center text-sm">
                <Share2 className="w-4 h-4" /> Share Event
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-secondary rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">{event.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-foreground">{event.start} - {event.end}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Organized by</p>
                  <p className="text-sm font-medium text-foreground">{event.organizer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
