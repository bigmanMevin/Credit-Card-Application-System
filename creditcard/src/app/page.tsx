import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl bg-white rounded p-8 shadow">
        <h1 className="text-4xl font-bold mb-4">Apply for a Credit Card</h1>
        <p className="text-gray-600 mb-6">
          Get your credit card in just a few simple steps. Complete your application online now.
        </p>
        
        <div className="mb-6 bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">Requirements:</h2>
          <ul className="list-disc ml-6 text-gray-600 text-sm">
            <li>Must be employed (Salaried or Self-Employed)</li>
            <li>Minimum salary: AED 10,000 per month</li>
            <li>Valid Emirates ID</li>
          </ul>
        </div>
        
        <Link href="/application">
          <button className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 w-full text-lg font-semibold">
            Start Application
          </button>
        </Link>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure application process. Your data is protected.
        </p>
      </div>
    </div>
  );
}
