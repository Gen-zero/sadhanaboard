// Touch gesture utilities for mobile interactions

// Swipe detection
export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
}

export const detectSwipe = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  threshold = 50
): SwipeDirection | null => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  // Check if the movement exceeds the threshold
  if (absDeltaX < threshold && absDeltaY < threshold) {
    return null;
  }

  // Determine primary direction
  if (absDeltaX > absDeltaY) {
    return {
      direction: deltaX > 0 ? 'right' : 'left',
      distance: absDeltaX
    };
  } else {
    return {
      direction: deltaY > 0 ? 'down' : 'up',
      distance: absDeltaY
    };
  }
};

// Long press detection
export const detectLongPress = (
  element: HTMLElement,
  callback: () => void,
  duration = 500
): (() => void) => {
  let pressTimer: NodeJS.Timeout | null = null;

  const startPress = () => {
    pressTimer = setTimeout(() => {
      callback();
      element.classList.add('pressed');
    }, duration);
  };

  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    element.classList.remove('pressed');
  };

  // Add event listeners
  element.addEventListener('touchstart', startPress);
  element.addEventListener('touchend', cancelPress);
  element.addEventListener('touchmove', cancelPress);
  element.addEventListener('touchcancel', cancelPress);

  // Return cleanup function
  return () => {
    cancelPress();
    element.removeEventListener('touchstart', startPress);
    element.removeEventListener('touchend', cancelPress);
    element.removeEventListener('touchmove', cancelPress);
    element.removeEventListener('touchcancel', cancelPress);
  };
};

// Double tap detection
export const detectDoubleTap = (
  element: HTMLElement,
  callback: () => void,
  delay = 300
): (() => void) => {
  let lastTap = 0;

  const handleTap = () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < delay && tapLength > 0) {
      callback();
      element.classList.add('double-tapped');
      setTimeout(() => {
        element.classList.remove('double-tapped');
      }, 300);
    }

    lastTap = currentTime;
  };

  // Add event listeners
  element.addEventListener('touchend', handleTap);

  // Return cleanup function
  return () => {
    element.removeEventListener('touchend', handleTap);
  };
};

// Touch ripple effect
export const addRippleEffect = (element: HTMLElement): (() => void) => {
  const createRipple = (event: TouchEvent) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.touches[0].clientX - rect.left - size / 2;
    const y = event.touches[0].clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    `;

    ripple.classList.add('ripple');

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Add CSS for ripple animation
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  element.addEventListener('touchstart', createRipple);

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', createRipple);
  };
};

// Prevent zoom on input focus
export const preventInputZoom = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
};

// Restore zoom capability
export const restoreInputZoom = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
  }
};