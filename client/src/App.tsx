import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Swipe from "@/pages/Swipe";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";

import OnboardingSurvey from "@/pages/OnboardingSurvey";

import Radar from "@/pages/Radar";

import Chat from "@/pages/Chat";
import UserProfile from "@/pages/UserProfile";
import EditProfile from "@/pages/EditProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/survey" component={OnboardingSurvey} />
      <Route path="/swipe" component={Swipe} />
      <Route path="/radar" component={Radar} />
      <Route path="/messages" component={Messages} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/user/:id" component={UserProfile} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/edit" component={EditProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
