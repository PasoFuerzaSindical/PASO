
import React from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { CampaignProvider } from './contexts/CampaignContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';

import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage'; 
import AcronymValidatorPage from './pages/AcronymValidatorPage';
import BingoPage from './pages/BingoPage';
import ConsultorioPage from './pages/ConsultorioPage';
import DashboardPage from './pages/DashboardPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import GalleryPage from './pages/GalleryPage';
import StrategyPage from './pages/StrategyPage';
import PosterGeneratorPage from './pages/PosterGeneratorPage';
import DiplomaEditorPage from './pages/DiplomaEditorPage';
import PersonajesPage from './pages/PersonajesPage';
import FilosofiaPage from './pages/FilosofiaPage';
import ExclusiveContentAdminPage from './pages/ExclusiveContentAdminPage';
import ExclusiveContentViewerPage from './pages/ExclusiveContentViewerPage';
import ConsultorioAdminPage from './pages/ConsultorioAdminPage';
import SettingsPage from './pages/SettingsPage';
import PageManagementPage from './pages/PageManagementPage';
import AcronymGeneratorPage from './pages/AcronymGeneratorPage';
import SimulatorPage from './pages/SimulatorPage'; 
import SimulatorAdminPage from './pages/SimulatorAdminPage'; 
import RealityWallPage from './pages/RealityWallPage';
import RealityWallAdminPage from './pages/RealityWallAdminPage';

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/content/')) return 'Contenido Exclusivo';
  switch (pathname) {
    case '/': return 'Zona de Triaje P.A.S.O.';
    case '/validator': return 'Validador de Acrónimos';
    case '/bingo': return 'Bingo del Precariado';
    case '/consultorio': return 'Consultorio Anónimo';
    case '/muro': return 'Muro de la Realidad';
    case '/simulator': return 'Simulador del Sistema';
    case '/filosofia': return 'Filosofía P.A.S.O.';
    case '/login': return 'Acceso Administrador';
    case '/dashboard': return 'Dashboard';
    case '/acronym-generator': return 'Generador de Acrónimos';
    case '/script-generator': return 'Generador de Contenido';
    case '/gallery': return 'Galería';
    case '/strategy': return 'Estrategia (Admin)';
    case '/poster-generator': return 'Generador de Carteles';
    case '/diploma-editor': return 'Editor de Diplomas';
    case '/personajes': return 'Personajes de Campaña';
    case '/exclusive-content': return 'Contenido Exclusivo';
    case '/consultorio-admin': return 'Revisión del Consultorio';
    case '/muro-admin': return 'Gestión del Muro';
    case '/settings': return 'Configuración General';
    case '/page-management': return 'Gestión de Páginas';
    case '/simulator-admin': return 'Config. Simulador';
    default: return 'P.A.S.O.';
  }
};

const MainAppLayout: React.FC = () => {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <MainLayout pageTitle={pageTitle}>
            <Outlet />
        </MainLayout>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider defaultTheme="dark" storageKey="paso-ui-theme">
        <AuthProvider>
          <CampaignProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={<MainAppLayout />}>
                {/* Public Routes */}
                <Route index element={<LandingPage />} />
                <Route path="validator" element={<AcronymValidatorPage />} />
                <Route path="bingo" element={<BingoPage />} />
                <Route path="consultorio" element={<ConsultorioPage />} />
                <Route path="muro" element={<RealityWallPage />} />
                <Route path="simulator" element={<SimulatorPage />} />
                <Route path="filosofia" element={<FilosofiaPage />} />
                <Route path="content/:id" element={<ExclusiveContentViewerPage />} />

                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="acronym-generator" element={<AcronymGeneratorPage />} />
                  <Route path="script-generator" element={<ScriptGeneratorPage />} />
                  <Route path="gallery" element={<GalleryPage />} />
                  <Route path="strategy" element={<StrategyPage />} />
                  <Route path="poster-generator" element={<PosterGeneratorPage />} />
                  <Route path="diploma-editor" element={<DiplomaEditorPage />} />
                  <Route path="personajes" element={<PersonajesPage />} />
                  <Route path="exclusive-content" element={<ExclusiveContentAdminPage />} />
                  <Route path="consultorio-admin" element={<ConsultorioAdminPage />} />
                  <Route path="muro-admin" element={<RealityWallAdminPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="page-management" element={<PageManagementPage />} />
                  <Route path="simulator-admin" element={<SimulatorAdminPage />} />
                </Route>
              </Route>
            </Routes>
          </CampaignProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
