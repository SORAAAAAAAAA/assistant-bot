import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { FAQPage } from '@/components/Faqs/Faqs';

// Create a placeholder for your chat interface for now
const ChatInterface = () => (
  <div className="p-8 h-full overflow-y-auto">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">
      Seiwa Kaiun AI Assistant
    </h1>
    <p className="text-gray-600">
      Your chat interface will populate here.
    </p>
  </div>
);

function App() {
  return (
    // Wrap the whole app in the Router component
    <Router>
      <div className="flex h-screen bg-gray-50 w-full overflow-hidden">

        {/* Sidebar stays fixed on the left */}
        <Sidebar />

        {/* The dynamic content area */}
        <main className="flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out">

          {/* The Routes component acts as the 'switch' to display different pages */}
          <Routes>
            {/* Default route (homepage/chat) */}
            <Route path="/chat" element={<ChatInterface />} />

            {/* FAQ Route */}
            <Route path="/faqs" element={<FAQPage />} />

            {/* Redirect any root path to /chat */}
            <Route path="/" element={<Navigate to="/chat" replace />} />

            {/* Catch-all for undefined routes (Optional) */}
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;