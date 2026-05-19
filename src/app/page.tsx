import LandingPage from "@/components/LandingPage";
import { getMemories } from "@/lib/getMemories";

export default async function Home() {
  const memories = await getMemories();
  return <LandingPage memories={memories} />;
}
