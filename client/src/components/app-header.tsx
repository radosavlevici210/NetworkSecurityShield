import { Shield, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SecurityStatus } from "@/lib/types";

export default function AppHeader() {
  const { data: status } = useQuery<SecurityStatus>({
    queryKey: ["/api/security/status"],
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">SecureGuard</h1>
              <p className="text-xs text-gray-500">System Security Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                status?.systemOnline ? 'bg-success' : 'bg-error'
              }`} />
              <span className="text-gray-600">
                {status?.systemOnline ? 'System Online' : 'System Offline'}
              </span>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
