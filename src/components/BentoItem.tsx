// src/components/BentoItem.tsx
// A simple BentoItem Wrapper component to be used inside the BentoGrid
export default function BentoItem({ index }: { index: number }) {
  return (
    <div className="flex bg-amber-200 min-h-full min-w-size  flex-col items-start gap-6 relative">
      <div>
        {":)"} - {index}
      </div>
    </div>
  );
}
