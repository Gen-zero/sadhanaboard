import LibraryContainer from "./LibraryContainer";

const SpiritualLibrary = () => {
  return (
    <div className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div className="space-y-6">
        <LibraryContainer />
      </div>
    </div>
  );
};

export default SpiritualLibrary;