import TimeDisplayGuestbook from "@/components/time-display-guestbook";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">GUESTBOOK</h1>
      <TimeDisplayGuestbook />
    </main>
  );
}
