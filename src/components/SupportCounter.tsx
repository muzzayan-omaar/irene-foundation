import { getSupporterCount } from "@/lib/supporters";

export default async function SupporterCounter() {
  const count = await getSupporterCount();

  return (
    <div className="text-center py-6">
      <div className="text-4xl font-bold">{count.toLocaleString()}</div>
      <p className="text-gray-500 text-sm">people have joined the movement</p>
    </div>
  );
}