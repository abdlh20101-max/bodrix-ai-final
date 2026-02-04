import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import FAQ from "./pages/FAQ";
import History from "./pages/History";
import Checkout from "./pages/Checkout";
import Wallet from "./pages/Wallet";
import Referrals from "./pages/Referrals";
import Ads from "./pages/Ads";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Reviews from "./pages/Reviews";
import Backups from "./pages/Backups";
import EmailNotifications from "./pages/EmailNotifications";
import Support from "./pages/Support";
import Tags from "./pages/Tags";
import Export from "./pages/Export";
import RealTimeNotifications from "./pages/RealTimeNotifications";
import Translation from "./pages/Translation";
import Analytics from "./pages/Analytics";
import Collaboration from "./pages/Collaboration";
import Automation from "./pages/Automation";
import Integrations from "./pages/Integrations";
import Ratings from "./pages/Ratings";
import PersonalStats from "./pages/PersonalStats";
import Certificates from "./pages/Certificates";
import Achievements from "./pages/Achievements";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import { useAuth } from "@/_core/hooks/useAuth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/chat" component={() => <ProtectedRoute component={Chat} />} />
      <Route path="/plans" component={() => <ProtectedRoute component={Plans} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
      <Route path="/faq" component={() => <ProtectedRoute component={FAQ} />} />
      <Route path="/history" component={() => <ProtectedRoute component={History} />} />
      <Route path="/checkout" component={() => <ProtectedRoute component={Checkout} />} />
      <Route path="/wallet" component={() => <ProtectedRoute component={Wallet} />} />
      <Route path="/referrals" component={() => <ProtectedRoute component={Referrals} />} />
      <Route path="/ads" component={() => <ProtectedRoute component={Ads} />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/reports" component={() => <ProtectedRoute component={Reports} />} />
      <Route path="/notifications" component={() => <ProtectedRoute component={Notifications} />} />
      <Route path="/search" component={() => <ProtectedRoute component={Search} />} />
      <Route path="/reviews" component={() => <ProtectedRoute component={Reviews} />} />
      <Route path="/backups" component={() => <ProtectedRoute component={Backups} />} />
      <Route path="/email-notifications" component={() => <ProtectedRoute component={EmailNotifications} />} />
      <Route path="/support" component={() => <ProtectedRoute component={Support} />} />
      <Route path="/tags" component={() => <ProtectedRoute component={Tags} />} />
      <Route path="/export" component={() => <ProtectedRoute component={Export} />} />
      <Route path="/real-time-notifications" component={() => <ProtectedRoute component={RealTimeNotifications} />} />
      <Route path="/translation" component={() => <ProtectedRoute component={Translation} />} />
      <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
      <Route path="/collaboration" component={() => <ProtectedRoute component={Collaboration} />} />
      <Route path="/automation" component={() => <ProtectedRoute component={Automation} />} />
      <Route path="/integrations" component={() => <ProtectedRoute component={Integrations} />} />
      <Route path="/ratings" component={() => <ProtectedRoute component={Ratings} />} />
      <Route path="/personal-stats" component={() => <ProtectedRoute component={PersonalStats} />} />
      <Route path="/certificates" component={() => <ProtectedRoute component={Certificates} />} />
      <Route path="/achievements" component={() => <ProtectedRoute component={Achievements} />} />
      <Route path="/challenges" component={() => <ProtectedRoute component={Challenges} />} />
      <Route path="/leaderboard" component={() => <ProtectedRoute component={Leaderboard} />} />
      <Route path="/rewards" component={() => <ProtectedRoute component={Rewards} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
