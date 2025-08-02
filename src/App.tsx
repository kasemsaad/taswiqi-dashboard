import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ReportsPage from "./pages/ReportsPage";
import DetailedReportsPage from "./pages/DetailedReportsPage";
import MarketersPage from "./pages/MarketersPage";
import MarketerProfilePage from "./pages/MarketerProfilePage";
import LinksCodes from "./pages/LinksCodes";
import RequsetWithdrawal from "./pages/RequsetWithdrawal";
import RequsetIinfo from "./pages/InfoRequest";
import InfoCustomersWithBalance from "./pages/InfoCustomersWithBalance";
import CompaniesPage from "./pages/CompaniesPage";
import AddCompanyPage from "./pages/AddCompanyPage";
import AddReferral from "./pages/AddReferral";
import EditReferral from "./pages/EditReferral";
import AddCode from "./pages/AddCode";
import EditCode from "./pages/EditCode";
import EditCompanyPage from "./pages/EditCompanyPage";
import AddReferralRequests from "./pages/AddRequestReferral";
import AddRequestCode from "./pages/AddRequestCode";
import RequestsPage from "./pages/RequestsPage";
import UploadExcelReferral from "./pages/UploadExcelReferral";
import UploadExcelCode from "./pages/UploadExcelCode";
import WithdrawalsPage from "./pages/WithdrawalsPage";
import CommunityPage from "./pages/CommunityPage";
import AchievementsPage from "./pages/AchievementsPage";
import SupportPage from "./pages/SupportPage";
import VerificationPage from "./pages/VerificationPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            <Route path="login" element={<Login  />} />
          <Route path="/"  element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
            <Route index element={<ReportsPage />} />
            <Route index element={<ReportsPage />} />
            <Route path="reports" element={<DetailedReportsPage />} />
            <Route path="marketers" element={<MarketersPage />} />
            <Route path="marketers/:id" element={<MarketerProfilePage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/add" element={<AddCompanyPage />} />
            <Route path="companies/edit/:id" element={<EditCompanyPage />} />
            <Route path="withdrawals" element={<WithdrawalsPage />} />
            <Route path="requsetWithdrawal" element={<RequsetWithdrawal />} />
            <Route path="requsetWithdrawal/info/:id" element={<RequsetIinfo />} />
            <Route path="requsetWithdrawal/infoCustomers/:id" element={<InfoCustomersWithBalance />} />
            <Route path="linksCodes" element={<LinksCodes />} />
            <Route path="LinksCodes/addReferral" element={<AddReferral />} />
            <Route path="LinksCodes/addReferral" element={<AddReferral />} />
            <Route path="LinksCodes/editReferral/:id" element={<EditReferral />} />
            <Route path="LinksCodes/addCode" element={<AddCode />} />
            <Route path="LinksCodes/editCode/:id" element={<EditCode />} />
            <Route path="LinksCodes/UploadExcelReferral" element={<UploadExcelReferral />} />
            <Route path="LinksCodes/UploadExcelCode" element={<UploadExcelCode />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="requests/addReferral/:id" element={<AddReferralRequests />} />
            <Route path="requests/addCode/:id" element={<AddRequestCode />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
