import React from 'react';
import Layout from "@/components/Layout";
import { TransparentGlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";
import CalendarView from "@/divya-panchang/components/CalendarView";

const CalendarPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <TransparentGlassMorphismContainer className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Your Calendar</h1>
            <p className="text-gray-400">Divya Panchang - Hindu Lunar Calendar</p>
          </div>
          <CalendarView />
        </TransparentGlassMorphismContainer>
      </div>
    </Layout>
  );
};

export default CalendarPage;