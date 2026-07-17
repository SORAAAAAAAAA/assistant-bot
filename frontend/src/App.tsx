import { useState } from 'react';
import Sidebar from '../components/Sidebar';

function App() {
  const [activeMenu, setActiveMenu] = useState('chat');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-white flex items-center px-6">
          <h1 className="text-lg font-semibold text-gray-800">
            {activeMenu === 'chat' && 'AI Assistant'}
            {activeMenu === 'history' && 'Inquiry History'}
            {activeMenu === 'faqs' && 'Frequently Asked Questions'}
            {activeMenu === 'support' && 'Support'}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <p className="text-gray-600">Main content for <strong>{activeMenu}</strong> will go here.</p>
        </main>
      </div>
    </div>
  );
}

export default App;