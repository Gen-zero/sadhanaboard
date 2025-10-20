import { useEffect } from 'react';

const SmoothScroll = () => {
  useEffect(() => {
    // Check if the browser supports scroll-behavior
    if (!('scrollBehavior' in document.documentElement.style)) {
      // Fallback for browsers that don't support smooth scrolling
      let isScrolling = false;
      
      const smoothScrollTo = (targetY: number, duration: number = 500) => {
        if (isScrolling) return;
        
        isScrolling = true;
        const startY = window.scrollY;
        const distance = targetY - startY;
        let startTime: number | null = null;
        
        const easeInOutQuad = (time: number, start: number, change: number, duration: number) => {
          time /= duration / 2;
          if (time < 1) return change / 2 * time * time + start;
          time--;
          return -change / 2 * (time * (time - 2) - 1) + start;
        };
        
        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = easeInOutQuad(timeElapsed, startY, distance, duration);
          
          window.scrollTo(0, run);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          } else {
            isScrolling = false;
          }
        };
        
        requestAnimationFrame(animation);
      };
      
      // Override window.scrollTo for smooth scrolling
      const originalScrollTo = window.scrollTo;
      window.scrollTo = function(options?: ScrollToOptions) {
        if (options && options.behavior === 'smooth') {
          smoothScrollTo(options.top || 0, 500);
        } else {
          originalScrollTo.apply(this, arguments as any);
        }
      };
    }
    
    // Add smooth scrolling to all anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return null;
};

export default SmoothScroll;