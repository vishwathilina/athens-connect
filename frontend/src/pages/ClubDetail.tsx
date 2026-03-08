import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Users, Calendar, MapPin, ArrowLeft } from "lucide-react";
import clubMeeting from "@/assets/club-meeting.jpg";
import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import { useParams, Link } from "react-router-dom";

const clubsData = [
  { id: 1, name: "Debate Society", category: "Academic", members: 120, image: event3, description: "Sharpen your argumentation and public speaking skills through competitive debate.", longDescription: "The Debate Society is one of the oldest and most prestigious clubs on campus. We host weekly practice sessions, participate in inter-university competitions, and organize public speaking workshops. Whether you're a seasoned debater or just starting out, our community welcomes you with open arms. Join us to develop critical thinking, research skills, and the confidence to speak your mind.", founded: "2018", meetingDay: "Every Wednesday", location: "Room 301, Humanities Building" },
  { id: 2, name: "Tech & Innovation Club", category: "Technology", members: 250, image: event2, description: "Build, hack, and innovate with like-minded tech enthusiasts on campus.", longDescription: "The Tech & Innovation Club is where ideas come to life. From hackathons to workshops on AI, web development, and data science, we provide the resources and community to help you grow as a technologist. We partner with industry leaders for mentorship and have helped launch over 15 student startups.", founded: "2019", meetingDay: "Every Friday", location: "Innovation Lab, Engineering Building" },
  { id: 3, name: "Photography Club", category: "Arts", members: 85, image: event1, description: "Capture campus life through your lens.", longDescription: "The Photography Club is a creative haven for visual storytellers. We organize photo walks, editing workshops, and annual exhibitions. Our members have won regional photography competitions and our work is featured in the university magazine.", founded: "2020", meetingDay: "Every Saturday", location: "Arts Studio, Creative Building" },
  { id: 4, name: "Community Service Club", category: "Social", members: 180, image: clubMeeting, description: "Make a difference in the community.", longDescription: "Dedicated to making a positive impact, the Community Service Club organizes volunteer events, fundraisers, and awareness campaigns. From tutoring local students to environmental cleanups, we believe every small action counts.", founded: "2017", meetingDay: "Every Tuesday", location: "Community Center, Student Union" },
  { id: 5, name: "Music & Band Society", category: "Arts", members: 95, image: event1, description: "Express yourself through music.", longDescription: "Whether you play an instrument, sing, or just love music, the Music & Band Society is your stage. We host jam sessions, open mics, and organize the annual Campus Concert that draws thousands of attendees.", founded: "2016", meetingDay: "Every Thursday", location: "Music Room, Performing Arts Center" },
  { id: 6, name: "Entrepreneurship Club", category: "Business", members: 200, image: event2, description: "Launch your startup journey.", longDescription: "The Entrepreneurship Club provides aspiring founders with mentorship, pitch nights, and networking opportunities. We've helped launch 20+ student ventures and our alumni have raised over $2M in funding.", founded: "2019", meetingDay: "Every Monday", location: "Business Incubator, Commerce Building" },
  { id: 7, name: "Environmental Club", category: "Social", members: 110, image: event1, description: "Advocate for sustainability on campus.", longDescription: "The Environmental Club leads sustainability initiatives including campus recycling programs, tree planting drives, and climate awareness campaigns. We work closely with university administration to implement green policies.", founded: "2020", meetingDay: "Every Wednesday", location: "Green Lab, Science Building" },
  { id: 8, name: "Sports & Fitness Club", category: "Athletics", members: 300, image: clubMeeting, description: "Stay active with team events.", longDescription: "From intramural leagues to fitness challenges, the Sports & Fitness Club keeps campus active and healthy. We organize tournaments in basketball, soccer, volleyball, and more. Everyone is welcome regardless of skill level.", founded: "2015", meetingDay: "Daily", location: "University Gymnasium" },
  { id: 9, name: "Film & Media Club", category: "Arts", members: 75, image: event3, description: "Explore the art of storytelling.", longDescription: "The Film & Media Club produces short films, documentaries, and multimedia content. We host film screenings, workshops on editing and cinematography, and participate in student film festivals across the country.", founded: "2021", meetingDay: "Every Saturday", location: "Media Lab, Communications Building" },
];

const ClubDetail = () => {
  const { id } = useParams();
  const club = clubsData.find(c => c.id === Number(id));

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-padding max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Club Not Found</h1>
          <Link to="/clubs" className="btn-primary text-sm">Back to Clubs</Link>
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
        <Link to="/clubs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Clubs
        </Link>

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 mb-10">
          <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.3)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <span className="tag-pill bg-primary text-primary-foreground text-xs border-none mb-4 inline-block">{club.category}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-[hsl(var(--surface-dark-foreground))]">{club.name}</h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Club</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{club.longDescription}</p>

            <h3 className="font-display text-xl font-bold text-foreground mb-4">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {["Weekly Meetings & Workshops", "Networking Opportunities", "Competition Participation", "Leadership Development", "Social Events & Retreats", "Mentorship Programs"].map(item => (
                <div key={item} className="flex items-center gap-3 bg-secondary rounded-xl p-4">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className="bg-secondary rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-2xl text-foreground">{club.members}</span>
                <span className="text-sm text-muted-foreground">members</span>
              </div>
              <button className="btn-primary w-full justify-center text-sm mb-3">
                Join This Club <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="btn-outline-dark w-full justify-center text-sm">
                Contact Club
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-secondary rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Meeting Schedule</p>
                  <p className="text-sm font-medium text-foreground">{club.meetingDay}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{club.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="text-sm font-medium text-foreground">{club.founded}</p>
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

export default ClubDetail;
