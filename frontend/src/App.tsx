import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from '@/pages/index';
import ChatPage from '@/pages/chat';
import HistoryPage from '@/pages/history';
import FaqsPage from '@/pages/faqs';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<IndexPage />} />

        {/* Protected Routes wrapped in the Layout */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
