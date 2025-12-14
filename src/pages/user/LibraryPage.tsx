import Layout from "@/components/Layout";
import SpiritualLibrary from "@/components/library/SpiritualLibrary";
import { TransparentGlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";

const LibraryPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <TransparentGlassMorphismContainer className="p-6">
          <SpiritualLibrary />
        </TransparentGlassMorphismContainer>
      </div>
    </Layout>
  );
};

export default LibraryPage;