import ContestTrackerHome from "./pages/home";
import ContestantDetails from "./pages/about";

export default function App() {
  const isAboutPage = window.location.pathname.includes("/about/");

  return (
    <main className="min-h-screen">
      {isAboutPage ? <ContestantDetails /> : <ContestTrackerHome />}
    </main>
  );
}
