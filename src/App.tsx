import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PageHeader } from './components/dashboard/PageHeader';
import { FocusNotesCarousel } from './components/dashboard/FocusNotesCarousel';
import { OverviewStats } from './components/dashboard/OverviewStats';
import { TaskSection } from './components/dashboard/TaskSection';
import { TaskModal } from './components/modals/TaskModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { MobileNavDrawer } from './components/modals/MobileNavDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

const DashboardContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans text-[#111827]">
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <Sidebar className="hidden lg:flex" />

      {/* 2. Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen pb-16 lg:pb-8">
        {/* Top Header Bar */}
        <Header />

        {/* Dashboard Main Canvas */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1200px] w-full mx-auto space-y-6">
          {/* Page Greeting & Action Header */}
          <PageHeader />

          {/* Focus Notes Carousel Banner (1106 x 152 px) */}
          <FocusNotesCarousel />

          {/* Overview Statistics Cards */}
          <OverviewStats />

          {/* My Tasks Section (Tabs, Search, Priority Filters & Rows) */}
          <TaskSection />
        </main>
      </div>

      {/* Fixed Bottom Navigation Bar for Mobile */}
      <MobileBottomNav />

      {/* Modals & Slide-out Drawers */}
      <TaskModal />
      <DeleteConfirmModal />
      <MobileNavDrawer />
    </div>
  );
};

export function App() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}

export default App;
