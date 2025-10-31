import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const CareersPage = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Video Editor",
      department: "Creative",
      type: "Full-time",
      description: "We're looking for a skilled Video Editor to help create compelling spiritual content for our community. You'll be responsible for editing videos that inspire and educate our users on their spiritual journeys.",
      requirements: [
        "2+ years of professional video editing experience",
        "Proficiency in Adobe Premiere Pro, After Effects, and DaVinci Resolve",
        "Strong understanding of visual storytelling",
        "Experience with spiritual or religious content is a plus",
        "Creative mindset with attention to detail"
      ],
      responsibilities: [
        "Edit and produce high-quality spiritual content",
        "Create engaging thumbnails and promotional materials",
        "Collaborate with our content team to develop creative concepts",
        "Ensure all content aligns with our spiritual values and mission"
      ]
    },
    {
      id: 2,
      title: "Full-Stack Developer",
      department: "Engineering",
      type: "Full-time",
      description: "We're seeking a talented Full-Stack Developer to help build and maintain our spiritual platform. You'll work on features that help users track their spiritual practices and connect with our community.",
      requirements: [
        "3+ years of experience with React and Node.js",
        "Experience with PostgreSQL or similar relational database",
        "Familiarity with cloud platforms (AWS, GCP, or Azure)",
        "Understanding of RESTful APIs and modern authentication",
        "Experience with TypeScript is preferred"
      ],
      responsibilities: [
        "Develop and maintain our web application features",
        "Build scalable APIs for our mobile and web clients",
        "Collaborate with designers and product managers",
        "Ensure application performance and security best practices"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 left-0 right-0 z-50 px-2 sm:px-4 pt-2 sm:pt-4">
        <nav className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
          <div className="relative flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 sm:h-12 sm:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                  }}
                />
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                    padding: '2px'
                  }}>
                  <div className="w-full h-full rounded-full bg-background/20" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                  SadhanaBoard
                </span>
                <span className="text-[10px] sm:text-xs text-yellow-400/70 font-medium tracking-wider hidden xs:block">
                  ✨ Your Digital Yantra
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
              <Button asChild variant="ghost" className="relative text-foreground/80 hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-amber-400/40 transition-all duration-300 group/btn overflow-hidden px-3 sm:px-4 py-2 text-sm touch-target-large">
                <Link to="/login">
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">Login</span>
                </Link>
              </Button>
              <Button asChild className="relative bg-gradient-to-r from-amber-500/80 via-yellow-500/80 to-amber-500/80 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 backdrop-blur-sm border border-amber-400/30 hover:border-yellow-400/50 shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm touch-target-large">
                <Link to="/waitlist">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-fuchsia-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                  <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                  <span className="relative z-10 flex items-center">
                    <span className="hidden xs:inline">Join Waitlist</span>
                    <span className="xs:hidden">Waitlist</span>
                    <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '2s' }} />
                  </span>
                </Link>
              </Button>
            </div>
            {/* Mobile Navigation - Using MobileNav component */}
            <div className="md:hidden">
              <Button 
                asChild 
                variant="ghost" 
                size="icon"
                className="relative z-50 touch-target-large"
                aria-label="Toggle navigation menu"
              >
                <Link to="/waitlist">
                  <span className="text-amber-300">Waitlist</span>
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400">
            Join Our Sacred Mission
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto mb-6 sm:mb-8">
            Help us build the world's first Digital Yantra for conscious evolution. 
            We're looking for passionate individuals who want to make a meaningful impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {jobOpenings.map((job) => (
            <Card key={job.id} className="backdrop-blur-lg bg-background/30 border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 h-full transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl overflow-hidden touch-target-large">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl text-amber-100">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 sm:px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-xs sm:text-sm">{job.department}</span>
                      <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs sm:text-sm">{job.type}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-amber-100 mb-4 sm:mb-6 text-sm sm:text-base">{job.description}</p>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-amber-200 mb-2">Requirements:</h3>
                  <ul className="list-disc list-inside text-amber-100 space-y-1 text-sm sm:text-base">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6 sm:mb-8">
                  <h3 className="font-semibold text-amber-200 mb-2">Responsibilities:</h3>
                  <ul className="list-disc list-inside text-amber-100 space-y-1 text-sm sm:text-base">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-base sm:text-lg py-4 sm:py-6 touch-target-large"
                  onClick={() => window.location.href = 'https://gen0.xyz/join-us'}
                >
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12 sm:mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-amber-100">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <h3 className="font-bold text-amber-200 mb-2">Spiritual Growth</h3>
              <p className="text-amber-100 text-sm sm:text-base">We believe in fostering genuine spiritual development through consistent practice</p>
            </div>
            <div className="p-4 sm:p-6 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <h3 className="font-bold text-amber-200 mb-2">Authentic Practice</h3>
              <p className="text-amber-100 text-sm sm:text-base">Encouraging sincere and dedicated spiritual practices rooted in tradition</p>
            </div>
            <div className="p-4 sm:p-6 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <h3 className="font-bold text-amber-200 mb-2">Community Connection</h3>
              <p className="text-amber-100 text-sm sm:text-base">Building bridges between practitioners to share wisdom and support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4">
        <footer className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
          <div className="relative z-20 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <img
                    src="/lovable-uploads/sadhanaboard_logo.png"
                    alt="SadhanaBoard Logo"
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer scale-110 shadow-lg shadow-amber-500/30 relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                    }}
                  />
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                      padding: '2px'
                    }}>
                    <div className="w-full h-full rounded-full bg-background/20" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                    SadhanaBoard
                  </span>
                  <span className="text-[10px] sm:text-xs text-yellow-400/70 font-medium tracking-wider">
                    ✨ Your Digital Yantra
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <Link to="/about" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">About</span>
                </Link>
                <Link to="/careers" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">Careers</span>
                </Link>
                <Link to="/privacy" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">Privacy</span>
                </Link>
                <Link to="/terms" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">Terms</span>
                </Link>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <div className="inline-block px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs text-muted-foreground/80"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(138, 43, 226, 0.08))',
                  border: '1px solid rgba(255, 215, 0, 0.15)'
                }}>
                © {new Date().getFullYear()} SadhanaBoard. All rights reserved. A sacred space for spiritual practitioners.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CareersPage;