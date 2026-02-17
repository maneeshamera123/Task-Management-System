export function Features() {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Everything You Need to Manage Your Tasks
      </h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">📋</span>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">Task Organization</h4>
          <p className="text-gray-600">
            Create, organize, and prioritize tasks with drag-and-drop simplicity and smart categorization.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">👥</span>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h4>
          <p className="text-gray-600">
            Work together in real-time with comments, file sharing, and team notifications.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">📈</span>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h4>
          <p className="text-gray-600">
            Visual dashboards and analytics to track project progress and team performance.
          </p>
        </div>
      </div>
    </section>
  );
}
