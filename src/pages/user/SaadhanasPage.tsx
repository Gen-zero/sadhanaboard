import Layout from "@/components/Layout";
import Saadhanas from "@/components/Saadhanas";

const SaadhanasPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl p-6">
          <Saadhanas />
        </div>
      </div>
    </Layout>
  );
};

export default SaadhanasPage;