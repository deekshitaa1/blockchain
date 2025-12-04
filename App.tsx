import React, { useState } from 'react';
import { User, Page, Role, Language } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import HealthRecordPage from './components/HealthRecord';
import PatientAnalysis from './components/PatientAnalysis';
import AiChatbot from './components/AiChatbot';
import FindDoctor from './components/FindDoctor';
import HealthSchemes from './components/HealthSchemes';
import FemaleHealth from './components/FemaleHealth';
import AuditTrail from './components/AuditTrail';
import ResearchData from './components/ResearchData';
import HowItWorks from './components/HowItWorks';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>(Page.Dashboard);
  const [language, setLanguage] = useState<Language>(Language.English);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage(Page.Dashboard);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderPage = () => {
    if (!user) return null;
    switch (page) {
      case Page.HealthRecord:
        return <HealthRecordPage user={user} language={language} />;
      case Page.PatientAnalysis:
        return <PatientAnalysis user={user} language={language} />;
      case Page.AiChatbot:
        return <AiChatbot language={language} />;
      case Page.FindDoctor:
        return <FindDoctor language={language} />;
      case Page.HealthSchemes:
        return <HealthSchemes language={language} />;
      case Page.FemaleHealth:
        return <FemaleHealth language={language} />;
      case Page.AuditTrail:
        return <AuditTrail user={user} language={language} />;
      case Page.ResearchData:
        return <ResearchData user={user} language={language} />;
      case Page.HowItWorks:
        return <HowItWorks language={language} />;
      case Page.Dashboard:
      default:
        return <Dashboard user={user} setPage={setPage} language={language} />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen font-sans">
      <div className="stars-bg"></div>
      {!user ? (
        <Login onLogin={handleLogin} language={language} />
      ) : (
        <>
          <Header user={user} setPage={setPage} onLogout={handleLogout} language={language} setLanguage={setLanguage} />
          <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
