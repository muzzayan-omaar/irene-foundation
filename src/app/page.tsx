import DonateForm from "@/components/DonateForm";
import SupporterCounter from "@/components/SupportCounter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Irene Namatovu Foundation</h1>
      <p className="text-gray-600 mb-8">Support our mission — every gift counts.</p>
      <DonateForm />
      <SupporterCounter />
    </main>
  );
}