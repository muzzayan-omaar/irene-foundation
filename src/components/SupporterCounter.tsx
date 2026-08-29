import { getSupporterCount } from "@/lib/supporters";

export default async function SupporterCounter() {
  const count = await getSupporterCount();

  return (
    <div className="text-center">
      <div className="font-mono text-5xl font-semibold text-clay">
        {count.toLocaleString()}
      </div>
      <p className="text-ink/60 text-sm mt-2">people have joined the movement</p>
    </div>
  );
}