import Link from 'next/link';

export function Header() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link 
          href="/login" 
          className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
