import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import UsersPage from "./pages/UsersPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import WalletsPage from "./pages/WalletsPage";
import TransactionsPage from "./pages/TransactionsPage";
import P2PPage from "./pages/P2PPage";
import MarketplacePage from "./pages/MarketplacePage";
import DisputesPage from "./pages/DisputesPage";
import CompliancePage from "./pages/CompliancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import CreateBlogPostPage from "./pages/CreateBlogPostPage";
import BlogPage from "./pages/BlogPage";
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
            <Route path="/" element={<ProtectedRoute><AdminLayout><Index /></AdminLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute><AdminLayout><UserDetailsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/wallets" element={<ProtectedRoute><AdminLayout><WalletsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><AdminLayout><TransactionsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><AdminLayout><BlogPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/blog/create" element={<ProtectedRoute><AdminLayout><CreateBlogPostPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/blog/edit/:id" element={<ProtectedRoute><AdminLayout><CreateBlogPostPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/p2p" element={<ProtectedRoute><AdminLayout><P2PPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><AdminLayout><MarketplacePage /></AdminLayout></ProtectedRoute>} />
            <Route path="/disputes" element={<ProtectedRoute><AdminLayout><DisputesPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/compliance" element={<ProtectedRoute><AdminLayout><CompliancePage /></AdminLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AdminLayout><AnalyticsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
