import Link from 'next/link';

export function Hero() {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="text-5xl font-bold text-gray-900 mb-6">
        Modern Task Management System
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Streamline your team's productivity with our comprehensive task management solution. 
        Organize projects, track progress, and collaborate seamlessly all in one place.
      </p>
      <div className="flex justify-center space-x-4">
        <Link 
          href="/signup" 
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
