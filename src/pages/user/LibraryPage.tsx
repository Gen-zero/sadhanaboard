import Layout from "@/components/Layout";
import SpiritualLibrary from "@/components/library/SpiritualLibrary";

const LibraryPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <SpiritualLibrary />
      </div>
    </Layout>
  );
};

export default LibraryPage;