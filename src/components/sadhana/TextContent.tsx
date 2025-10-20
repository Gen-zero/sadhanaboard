
import { Text } from '@react-three/drei';

interface TextContentProps {
  content: string;
}

const TextContent = ({ content }: TextContentProps) => {
  return (
    <Text
      position={[0, 0, 0.01]}
      fontSize={0.2}
      maxWidth={4}
      lineHeight={1.2}
      color="#36454F" // Charcoal text color
      anchorX="center"
      anchorY="middle"
      font="/fonts/sf-pro-display-regular.woff"
    >
      {content}
    </Text>
  );
};

export default TextContent;
