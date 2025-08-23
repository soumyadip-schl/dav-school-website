import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Academics from "@/pages/academics";
import Admissions from "@/pages/admissions";
import Gallery from "@/pages/gallery";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import EventsPage from "@/pages/events";
import { EventsProvider } from "@/context/events-context"; // <-- RENAMED
import { Analytics } from "@vercel/analytics/react"; // <-- NEW
import { SpeedInsights } from "@vercel/speed-insights/react"; // <-- NEW

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/academics" component={Academics} />
        <Route path="/admissions" component={Admissions} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route path="/events" component={EventsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <EventsProvider>
          <Router />
          <Analytics />
          <SpeedInsights />
        </EventsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
