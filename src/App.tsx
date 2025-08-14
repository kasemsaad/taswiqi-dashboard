import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ReportsPage from "./pages/markter/Reports/ReportsPage";
import DetailedReportsPage from "./pages/Don`tUse/DetailedReportsPage";
import MarketersPage from "./pages/markter/Markter/MarketersPage";
import MarketerProfilePage from "./pages/markter/Markter/MarketerProfilePage";
import Categories from "./pages/markter/Category/CategoryPage";
import AddCategory from "./pages/markter/Category/AddCategoryPage";
import EditCategory from "./pages/markter/Category/EditCategoryPage";
import Countries from "./pages/markter/Countries/CountryPage";
import AddCountry from "./pages/markter/Countries/AddCountryPage";
import EditCountry from "./pages/markter/Countries/EditCountryPage";
import LinksCodes from "./pages/markter/ReferralCode/LinksCodes";
import RequsetWithdrawal from "./pages/markter/Withdrawal/RequsetWithdrawal";
import RequsetIinfo from "./pages/markter/Withdrawal/InfoRequest";
import InfoCustomersWithBalance from "./pages/markter/Withdrawal/InfoCustomersWithBalance";
import CompaniesPage from "./pages/markter/Companies/CompaniesPage";
import AddCompanyPage from "./pages/markter/Companies/AddCompanyPage";
import Badges from "./pages/markter/Badges/BadgesPage";
import AddBadgesPage from "./pages/markter/Badges/AddBadgePage";
import EditBadgePage from "./pages/markter/Badges/EditBadgePage";
import AddReferral from "./pages/markter/ReferralCode/AddReferral";
import EditReferral from "./pages/markter/ReferralCode/EditReferral";
import AddCode from "./pages/markter/ReferralCode/AddCode";
import EditCode from "./pages/markter/ReferralCode/EditCode";
import EditCompanyPage from "./pages/markter/Companies/EditCompanyPage";
import AddReferralRequests from "./pages/markter/Requestes/AddRequestReferral";
import AddRequestCode from "./pages/markter/Requestes/AddRequestCode";
import RequestsPage from "./pages/markter/Requestes/RequestsPage";
import UploadExcelReferral from "./pages/markter/ReferralCode/UploadExcelReferral";
import UploadExcelCode from "./pages/markter/ReferralCode/UploadExcelCode";
import WithdrawalsPage from "./pages/markter/Withdrawal/WithdrawalsPage";
import CommunityPage from "./pages/Don`tUse/CommunityPage";
import AchievementsPage from "./pages/Don`tUse/AchievementsPage";
import Qr from "./pages/markter/Qr/Qr";
import QrAdd from "./pages/markter/Qr/QrAdd";
import SupportPage from "./pages/markter/Support/SupportPage";
import VerificationPage from "./pages/markter/Approval/VerificationPage";
import EditVerificationPage from "./pages/markter/Approval/VerfcationRequest";
import AddNotification from "./pages/markter/Notifications/AddNotification";
import SettingsPage from "./pages/markter/Setting/SettingsPage";
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
          <Route path="login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ReportsPage />} />
            <Route index element={<ReportsPage />} />
            <Route path="reports" element={<DetailedReportsPage />} />
            <Route path="marketers" element={<MarketersPage />} />
            <Route path="marketers/:id" element={<MarketerProfilePage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="badges" element={<Badges />} />
            <Route path="badges/add" element={<AddBadgesPage />} />
            <Route path="badges/edit/:id" element={<EditBadgePage />} />
            <Route path="companies/add" element={<AddCompanyPage />} />
            <Route path="companies/edit/:id" element={<EditCompanyPage />} />
            <Route path="withdrawals" element={<WithdrawalsPage />} />
            <Route path="requsetWithdrawal" element={<RequsetWithdrawal />} />
            <Route
              path="requsetWithdrawal/info/:id"
              element={<RequsetIinfo />}
            />
            <Route
              path="requsetWithdrawal/infoCustomers/:id"
              element={<InfoCustomersWithBalance />}
            />
            <Route path="linksCodes" element={<LinksCodes />} />
            <Route path="LinksCodes/addReferral" element={<AddReferral />} />
            <Route
              path="LinksCodes/editReferral/:id"
              element={<EditReferral />}
            />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route
              path="categories/edit/:id"
              element={<EditCategory />}
            />
            <Route path="countries" element={<Countries />} />
            <Route path="countries/add" element={<AddCountry />} />
            <Route
              path="countries/edit/:id"
              element={<EditCountry />}
            />
            <Route path="LinksCodes/addCode" element={<AddCode />} />
            <Route path="LinksCodes/editCode/:id" element={<EditCode />} />
            <Route
              path="LinksCodes/UploadExcelReferral"
              element={<UploadExcelReferral />}
            />
            <Route
              path="LinksCodes/UploadExcelCode"
              element={<UploadExcelCode />}
            />
            <Route path="requests" element={<RequestsPage />} />
            <Route
              path="requests/addReferral/:id"
              element={<AddReferralRequests />}
            />
            <Route path="requests/addCode/:id" element={<AddRequestCode />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route
              path="verification/edit/:id"
              element={<EditVerificationPage />}
            />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="notification" element={<AddNotification />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="qr" element={<Qr />} />
            <Route path="qr/add" element={<QrAdd />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
