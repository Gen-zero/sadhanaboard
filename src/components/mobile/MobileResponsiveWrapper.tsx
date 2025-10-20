import { useIsMobile } from '@/hooks/use-mobile';
import Layout from '../Layout';

interface MobileResponsiveWrapperProps {
  children: React.ReactNode;
}

const MobileResponsiveWrapper: React.FC<MobileResponsiveWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();

  // Use the same Layout component for both mobile and desktop
  // The Layout component now handles responsive behavior internally
  return <Layout>{children}</Layout>;
};

export default MobileResponsiveWrapper;