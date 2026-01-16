import Header from "@/components/Header";
import Search from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-black to-gray-900">
      <Header />
      <Search />
    </main>
  );
}
