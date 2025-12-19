import Layout from "@/components/Layout";
import Saadhanas from "@/components/Saadhanas";
import { GlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";

const SaadhanasPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <GlassMorphismContainer>
          <Saadhanas />
        </GlassMorphismContainer>
      </div>
    </Layout>
  );
};

export default SaadhanasPage;