import { Sidebar } from '@/components/Sidebar/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      <Sidebar />

      {/* Increased duration to 500 for a smoother glide */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out">
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