import { useState } from "react";

import viteLogo from "/logo1.png";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Logo section */}
      <div className="flex space-x-2">
      <img src={viteLogo} className="h-12 w-12" alt="Vite logo" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mt-6">Medic App</h1>

      {/* Counter section */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
        >
          Count is {count}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Edit <code className="px-1 bg-gray-200 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;