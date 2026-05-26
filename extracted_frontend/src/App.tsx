import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import FaqPage from "@/pages/FaqPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/faq" component={FaqPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(10,10,20,0.95)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#f8fafc",
                backdropFilter: "blur(16px)",
              },
            }}
          />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
