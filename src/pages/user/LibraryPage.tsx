import Layout from "@/components/Layout";
import SpiritualLibrary from "@/components/library/SpiritualLibrary";
import { TransparentGlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";

const LibraryPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl p-6">
          <SpiritualLibrary />
        </div>
      </div>
    </Layout>
  );
};

export default LibraryPage;