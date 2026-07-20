import { Sidebar } from '@/components/Sidebar/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">

      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Chat Interface */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        <div className="p-8 h-full overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Seiwa Kaiun AI Assistant
          </h1>
          <p className="text-gray-600">
            The layout is now fixed. Your chat interface will populate here.
          </p>
        </div>
      </main>

    </div>
  );
}

export default App;