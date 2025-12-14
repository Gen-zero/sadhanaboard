import LibraryContainer from "./LibraryContainer";
import { TransparentGlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";

const SpiritualLibrary = () => {
  return (
    <TransparentGlassMorphismContainer className="rounded-lg p-6">
      <div className="space-y-6">
        <LibraryContainer />
      </div>
    </TransparentGlassMorphismContainer>
  );
};

export default SpiritualLibrary;