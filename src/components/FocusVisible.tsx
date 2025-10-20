import { useEffect } from 'react';

const FocusVisible = () => {
  useEffect(() => {
    const handleKeyDown = () => {
      document.body.classList.add('user-is-tabbing');
    };

    const handleMouseDown = () => {
      document.body.classList.remove('user-is-tabbing');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return null;
};

export default FocusVisible;