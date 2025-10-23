import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ManifestoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
          <div className="relative flex items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-12 w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30"
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
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                  SadhanaBoard
                </span>
                <span className="text-xs text-yellow-400/70 font-medium tracking-wider">
                  ✨ Your Digital Yantra
                </span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-foreground/80 hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-amber-400/40 transition-all duration-300">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-500/80 via-yellow-500/80 to-amber-500/80 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 backdrop-blur-sm border border-amber-400/30 hover:border-yellow-400/50 shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300">
                <Link to="/waitlist">Join Waitlist</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Sadhana Paper Container - Transparent Golden Metallic styling */}
          <div 
            className="relative p-8 rounded-3xl border-2 backdrop-blur-md"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 223, 0, 0.05) 0%, rgba(255, 215, 0, 0.08) 30%, rgba(255, 207, 0, 0.04) 70%, rgba(255, 199, 0, 0.06) 100%)',
              borderColor: 'rgba(255, 215, 0, 0.3)',
              fontFamily: 'Georgia, serif',
              boxShadow: `
                0 8px 32px rgba(255, 215, 0, 0.12),
                0 0 0 1px rgba(255, 215, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                inset 0 -1px 0 rgba(255, 215, 0, 0.08)
              `,
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)'
            }}
          >
            {/* Metallic overlay gradient */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 200, 0.08) 0%, 
                    transparent 25%, 
                    rgba(255, 223, 0, 0.05) 50%, 
                    transparent 75%, 
                    rgba(255, 255, 180, 0.03) 100%
                  )
                `,
                opacity: 0.5
              }}
            />
            
            {/* Enhanced ornate corners with golden metallic effect */}
            <div 
              className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg"
              style={{
                borderColor: 'rgba(255, 215, 0, 0.8)',
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
              }}
            />
            <div 
              className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg"
              style={{
                borderColor: 'rgba(255, 215, 0, 0.8)',
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
              }}
            />
            <div 
              className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg"
              style={{
                borderColor: 'rgba(255, 215, 0, 0.8)',
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
              }}
            />
            <div 
              className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-lg"
              style={{
                borderColor: 'rgba(255, 215, 0, 0.8)',
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
              }}
            />
            
            {/* Header with enhanced golden styling */}
            <div className="text-center mb-8 relative z-10">
              <h1 
                className="text-4xl font-bold mb-4" 
                style={{ 
                  fontFamily: 'Georgia, serif',
                  color: 'rgba(255, 223, 0, 0.95)',
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                🕉 SaadhanaBoard Manifesto
              </h1>
              <div 
                className="w-32 h-0.5 mx-auto"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.8), transparent)',
                  filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.4))'
                }}
              />
            </div>

            {/* Content with enhanced golden metallic text */}
            <div className="space-y-6 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
              <div>
                <h2 
                  className="font-bold mb-3 text-2xl"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  A Digital Yantra for the Age of Awakening
                </h2>
              </div>
              
              <div>
                <h3 
                  className="font-bold mb-2 text-xl"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  🔸 Invocation (Mangalācharaṇam)
                </h3>
              </div>
              
              <div className="text-center">
                <p 
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  ॐ
                </p>
                
                <p 
                  className="text-lg mb-2"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  Om — The primordial vibration, the sound of all creation.
                </p>
                
                <p 
                  className="text-lg mb-2"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  ॐ गँ गुरुभ्यो नमः
                </p>
                
                <p 
                  className="text-lg mb-4"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  Om Gum Gurubhyo Namaḥ
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Salutations to the Ādi Guru, the first teacher, the eternal source of light and wisdom who 
                  awakens knowledge in every being.
                </p>
                
                <p 
                  className="text-lg mb-2"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  ॐ गं गणपतये नमः
                </p>
                
                <p 
                  className="text-lg mb-4"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  Om Gam Ganapataye Namaḥ
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Salutations to Lord Ganesha, remover of obstacles and guardian of all auspicious 
                  beginnings.
                </p>
                
                <p 
                  className="text-lg mb-2"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  ॐ क्रीं कालकायै नमः
                </p>
                
                <p 
                  className="text-lg mb-4"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  Om Krīṃ Kālikāyai Namaḥ
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Salutations to Mā Kāli, the power of transformation, who destroys ignorance and reveals 
                  the eternal truth.
                </p>
                
                <p 
                  className="text-base italic leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  May the blessings of the Guru, the Mother, and the Divine guide this mission with clarity, 
                  discipline, and grace.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-bold mb-3 text-xl"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  The Manifesto
                </h3>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  For centuries, the wisdom of Hinduism has guided humanity, yet today's seekers are 
                  scattered, unsure where to begin or how to grow.  The teachings are vast, the guidance fragmented, and the sacred path often lost in noise.  The modern seeker deserves a living system that brings clarity, structure, and authenticity 
                  back to their spiritual journey.
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  SaadhanaBoard was created to answer that call.  It is not just an app, but a Digital Yantra, an instrument that creates a sacred space for your 
                  spiritual journey.
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Here, seekers can learn authentically, practice daily, track their growth, and walk their path 
                  with guidance from genuine teachers and communities.
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  We believe that discipline is devotion, and technology can be sacred when used with 
                  intention.  We honor all paths, all mantras, and all deities as threads of one truth.  We stand against misinformation, false gurus, and ego-driven spirituality, and we uphold 
                  authenticity, unity, and collective awakening.
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Our vision is a world where every Hindu, and every human, lives with awareness, devotion, 
                  and conscious action.  SaadhanaBoard exists to help you rediscover your dharma, reconnect with your divine 
                  essence, and live your faith with clarity and purpose.
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  We are SaadhanaBoard.
                </p>
                
                <p 
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  We are building the world's first Digital Yantra for conscious evolution.  Learn. Practice. Reflect. Evolve. Awaken.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-bold mb-3 text-xl"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  🔸 Pūrṇāhuti (Closing Offering)
                </h3>
                
                <p 
                  className="text-lg mb-2 text-center"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  ॐ पूणमदः पूणमदं पूणात् पूणमुदच्यते ।  पूणस्य पूणमादाय पूणमेवावशष्यते ॥
                </p>
                
                <p 
                  className="text-lg mb-4 text-center"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  Om Pūrṇam Adaḥ Pūrṇam Idaṃ Pūrṇāt Pūrṇam Udachyate  Pūrṇasya Pūrṇam Ādāya Pūrṇam Evāvaśiṣyate.
                </p>
                
                <p 
                  className="text-lg mb-2 text-center"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  ॐ शाितः शाितः शाितः
                </p>
                
                <p 
                  className="text-lg text-center"
                  style={{
                    color: 'rgba(255, 223, 0, 0.95)',
                    textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  Om Shāntiḥ Shāntiḥ Shāntiḥ
                </p>
                
                <p 
                  className="text-base italic text-center leading-relaxed mt-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Peace in the heavens, peace on earth, peace within.
                </p>
              </div>
            </div>

            {/* Enhanced metallic texture overlay */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(255, 223, 0, 0.05) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.04) 0%, transparent 40%),
                  radial-gradient(circle at 40% 80%, rgba(255, 207, 0, 0.03) 0%, transparent 30%)
                `,
                opacity: 0.4
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <footer className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
          <div className="relative z-20 container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/lovable-uploads/sadhanaboard_logo.png"
                    alt="SadhanaBoard Logo"
                    className="h-10 w-10 rounded-full cursor-pointer scale-110 shadow-lg shadow-amber-500/30 relative z-10"
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
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                    SadhanaBoard
                  </span>
                  <span className="text-xs text-yellow-400/70 font-medium tracking-wider">
                    ✨ Your Digital Yantra
                  </span>
                </div>
              </div>
              <div className="flex space-x-6 text-sm">
                <Link to="/about" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">About</span>
                </Link>
                <Link to="/careers" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">Careers</span>
                </Link>
                <a href="#" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">Privacy</span>
                </a>
                <a href="#" className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10">
                  <span className="relative z-10">Terms</span>
                </a>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-block px-4 py-2 rounded-full text-xs text-muted-foreground/80"
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

export default ManifestoPage;