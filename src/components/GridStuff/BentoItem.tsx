// src/components/BentoItem.tsx
// A simple BentoItem Wrapper component to be used inside the BentoGrid
export default function BentoItem({ index, ...props }: { index: number }) {
  console.log("Rendering BentoItem", index, props);
  return (
    <div className="flex bg-white/40 min-h-full min-w-full gap-6 relative">
      <div className="font-serif min-h-full min-w-full text-black text-3xl p-4 justify-center align-center">
        {":)"} - {index}
      </div>
    </div>
  );
}
