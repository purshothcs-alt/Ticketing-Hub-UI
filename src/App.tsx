import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Layout } from "./shared/components/Layout";
import { LoginForm } from "./feature/auth/components/LoginForm";
import { SignupForm } from "./feature/auth/components/SignupForm";
import { DashboardPage } from "./feature/dashboard/components/DashboardPage";
import { TicketsPage } from "./feature/tickets/components/TicketsPage";
import { TicketDetailsPage } from "./feature/tickets/components/TicketDetailsPage";
import { ReportsPage } from "./feature/reports/components/ReportsPage";
import { UsersPage } from "./feature/users/components/UsersPage";
import { RolesPage } from "./feature/roles/components/RolesPage";
import { DepartmentsPage } from "./feature/departments/components/DepartmentsPage";
import { SettingsPage } from "./feature/settings/components/SettingsPage";
import { SLAPage } from "./feature/sla/components/SLAPage";
import { NotificationsPage } from "./feature/notifications/components/NotificationsPage";
import { ConfigurationPage } from "./feature/configuration/components/ConfigurationPage";
import { ForgotPasswordForm } from "./feature/auth/components/ForgotForm";
import { useToast } from "./shared/hooks/toastHook";
import { registerToast } from "./shared/bus/toastBus";
import Toast from "./shared/components/Toast";
import GlobalLoader from "./shared/components/GlobalLoader";
import { clearSession, getToken } from "./shared/utils/helper";

// Create MUI theme with professional corporate colors
const createAppTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#3B82F6" : "#1976D2", // Professional blue
        light: isDarkMode ? "#60A5FA" : "#42A5F5",
        dark: isDarkMode ? "#2563EB" : "#1565C0",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: isDarkMode ? "#64748B" : "#546E7A", // Professional gray
        light: isDarkMode ? "#94A3B8" : "#78909C",
        dark: isDarkMode ? "#475569" : "#37474F",
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDarkMode ? "#0F172A" : "#F5F7FA",
        paper: isDarkMode ? "#1E293B" : "#FFFFFF",
      },
      text: {
        primary: isDarkMode ? "#F1F5F9" : "#1A202C",
        secondary: isDarkMode ? "#94A3B8" : "#64748B",
      },
      error: {
        main: isDarkMode ? "#EF4444" : "#D32F2F",
        light: isDarkMode ? "#F87171" : "#E57373",
        dark: isDarkMode ? "#DC2626" : "#C62828",
        contrastText: "#FFFFFF",
      },
      success: {
        main: isDarkMode ? "#10B981" : "#43A047", // Professional green
        light: isDarkMode ? "#34D399" : "#66BB6A",
        dark: isDarkMode ? "#059669" : "#2E7D32",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: isDarkMode ? "#F59E0B" : "#FFA726",
        light: isDarkMode ? "#FBBF24" : "#FFB74D",
        dark: isDarkMode ? "#D97706" : "#F57C00",
        contrastText: "#1A202C",
      },
      info: {
        main: isDarkMode ? "#0EA5E9" : "#0288D1",
        light: isDarkMode ? "#38BDF8" : "#03A9F4",
        dark: isDarkMode ? "#0284C7" : "#01579B",
        contrastText: "#FFFFFF",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            padding: "8px 16px",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
          },
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              backgroundColor: isDarkMode
                ? "rgba(59, 130, 246, 0.08)"
                : "rgba(25, 118, 210, 0.04)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            boxShadow: isDarkMode
              ? "0 1px 3px rgba(0, 0, 0, 0.5)"
              : "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
            border: isDarkMode
              ? "1px solid rgba(51, 65, 85, 0.5)"
              : "1px solid rgba(226, 232, 240, 0.8)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.6)"
                : "0 4px 8px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.75rem",
          },
          colorPrimary: {
            background: isDarkMode
              ? "rgba(59, 130, 246, 0.2)"
              : "rgba(25, 118, 210, 0.1)",
            color: isDarkMode ? "#60A5FA" : "#1565C0",
          },
          colorSecondary: {
            background: isDarkMode
              ? "rgba(100, 116, 139, 0.2)"
              : "rgba(84, 110, 122, 0.1)",
            color: isDarkMode ? "#94A3B8" : "#37474F",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            backgroundImage: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "#3B82F6" : "#1976D2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "#3B82F6" : "#1976D2",
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
  });

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!getToken();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Auth Route wrapper (redirect to dashboard if already authenticated)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!getToken();
  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

// ----------- AUTH PAGES ----------
const AuthPages = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  if (path === "/signup") {
    return <SignupForm onBackToLogin={() => navigate("/login")} />;
  }
  if (path === "/forgotpassword") {
    return <ForgotPasswordForm onBackToLogin={() => navigate("/login")} />;
  }
  return (
    <LoginForm
      onForgotPassword={() => navigate("/forgotpassword")}
      onSignup={() => navigate("/signup")}
    />
  );
};

// ----------- MAIN APP ROUTES ----------
interface AppRoutesProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppRoutes : React.FC<AppRoutesProps> = ({isDarkMode, setIsDarkMode}) => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev:any) => !prev);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <AuthPages />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <AuthPages />
          </AuthRoute>
        }
      />
      <Route
        path="/forgotpassword"
        element={
          <AuthRoute>
            <AuthPages />
          </AuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout
              isSidebarCollapsed={isSidebarCollapsed}
              isDarkMode={isDarkMode}
              onToggleSidebar={toggleSidebar}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
            >
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <DashboardPage
                      onNavigate={(page) => navigate(`/${page}`)}
                    />
                  }
                />

                <Route path="/tickets" element={<TicketsPage />} />
                <Route
                  path="/tickets/:id/*"
                  element={<TicketDetailsPage />}
                />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/configuration" element={<ConfigurationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/sla" element={<SLAPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// ----------- APP COMPONENT ----------
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { open, message, severity, showToast, hideToast } = useToast();

  useEffect(() => {
    registerToast({ showToast });
  }, []);

  return (
    <>
      <Toast
        open={open}
        message={message}
        severity={severity}
        handleClose={hideToast}
      />
      <GlobalLoader />
      <Router>
        <ThemeProvider theme={createAppTheme(isDarkMode)}>
          <CssBaseline />
          <AppRoutes
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode} />
        </ThemeProvider>
      </Router>
    </>
  );
}
