
import { useState } from 'react';
import PaperMesh from './PaperMesh';
import TextContent from './TextContent';

interface PaperProps {
  content: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const PaperScroll = ({ content, position, rotation }: PaperProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* Paper background */}
      <PaperMesh 
        hovered={hovered}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      
      {/* Paper content */}
      <TextContent content={content} />
    </group>
  );
};

export default PaperScroll;
