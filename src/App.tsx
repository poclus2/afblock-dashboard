import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import UsersPage from "./pages/UsersPage";
import WalletsPage from "./pages/WalletsPage";
import TransactionsPage from "./pages/TransactionsPage";
import P2PPage from "./pages/P2PPage";
import MarketplacePage from "./pages/MarketplacePage";
import DisputesPage from "./pages/DisputesPage";
import CompliancePage from "./pages/CompliancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login page without AdminLayout */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes with AdminLayout */}
            <Route path="/" element={<AdminLayout><Index /></AdminLayout>} />
            <Route path="/users" element={<AdminLayout><UsersPage /></AdminLayout>} />
            <Route path="/wallets" element={<AdminLayout><WalletsPage /></AdminLayout>} />
            <Route path="/transactions" element={<AdminLayout><TransactionsPage /></AdminLayout>} />
            <Route path="/p2p" element={<AdminLayout><P2PPage /></AdminLayout>} />
            <Route path="/marketplace" element={<AdminLayout><MarketplacePage /></AdminLayout>} />
            <Route path="/disputes" element={<AdminLayout><DisputesPage /></AdminLayout>} />
            <Route path="/compliance" element={<AdminLayout><CompliancePage /></AdminLayout>} />
            <Route path="/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
            <Route path="/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
