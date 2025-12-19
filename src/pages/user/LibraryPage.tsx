import Layout from "@/components/Layout";
import SpiritualLibrary from "@/components/library/SpiritualLibrary";
import { GlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";

const LibraryPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <GlassMorphismContainer>
          <SpiritualLibrary />
        </GlassMorphismContainer>
      </div>
    </Layout>
  );
};

export default LibraryPage;