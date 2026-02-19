import { getCopyrightText } from "@/lib/utils/date";

export function Footer() {
  return (
      <footer className="px-6 py-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white">TaskFlow</span>
          </div>
          <div className="text-sm">
            {getCopyrightText("TaskFlow")}
          </div>
        </div>
      </footer>
  );
}
