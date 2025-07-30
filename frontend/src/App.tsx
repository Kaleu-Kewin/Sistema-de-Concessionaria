
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Usuarios from "./pages/Usuarios";
import Veiculos from "./pages/Veiculos";
import Vendas from "./pages/Vendas";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><Layout><Clientes /></Layout></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Layout><Usuarios /></Layout></ProtectedRoute>} />
            <Route path="/veiculos" element={<ProtectedRoute><Layout><Veiculos /></Layout></ProtectedRoute>} />
            <Route path="/vendas" element={<ProtectedRoute><Layout><Vendas /></Layout></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><Layout><Perfil /></Layout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
