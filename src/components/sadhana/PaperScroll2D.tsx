import React from 'react';

interface PaperScroll2DProps {
  content: string;
  onClick?: () => void;
}

const PaperScroll2D: React.FC<PaperScroll2DProps> = ({ content, onClick }) => {
  // Split content by line breaks to properly format
  const contentLines = content.trim().split('\n').filter(line => line.trim() !== '');
  
  return (
    <div 
      className="relative w-full max-w-2xl mx-auto cursor-pointer hover-lift"
      onClick={onClick}
    >
      {/* Paper background with parchment texture */}
      <div className="relative overflow-hidden rounded-lg shadow-xl">
        <div 
          className="bg-[url('/textures/parchment.jpg')] bg-cover bg-center p-8 sm:p-10"
          style={{ 
            minHeight: '400px',
            boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Gold ornamental border */}
          <div className="absolute inset-0 border-[12px] border-[rgba(255,215,0,0.15)] rounded-lg pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10 font-serif space-y-4 text-[#36454F]">
            {contentLines.map((section, index) => {
              // Check if this is a section header (ends with a colon)
              if (section.trim().endsWith(':')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-[#36454F] opacity-90 first:mt-0">
                    {section}
                  </h3>
                );
              }
              // Otherwise it's regular content
              return (
                <p key={index} className="leading-relaxed">
                  {section}
                </p>
              );
            })}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-16 h-16 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#36454F" strokeWidth="2" />
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="#36454F" strokeWidth="2" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#36454F" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="absolute bottom-4 right-4 w-16 h-16 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#36454F" strokeWidth="2" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#36454F" strokeWidth="2" />
              <path d="M25,25 L75,75 M25,75 L75,25" stroke="#36454F" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Shadow effect */}
      <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-xl rounded-full z-0"></div>
      
      {/* Soft glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-lg blur-xl opacity-70 -z-10 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default PaperScroll2D;
