import { Card, CardContent } from "@/components/ui/card";
import { Ban, Flame, Power, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SecurityStatus } from "@/lib/types";

export default function SecurityOverview() {
  const { data: status, isLoading } = useQuery<SecurityStatus>({
    queryKey: ["/api/security/status"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remote Access</p>
                <p className={`text-2xl font-bold mt-1 ${
                  status?.remoteAccessBlocked ? 'text-error' : 'text-warning'
                }`}>
                  {status?.remoteAccessBlocked ? 'BLOCKED' : 'ALLOWED'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                status?.remoteAccessBlocked ? 'bg-red-100' : 'bg-orange-100'
              }`}>
                <Ban className={`text-xl ${
                  status?.remoteAccessBlocked ? 'text-error' : 'text-warning'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                status?.remoteAccessBlocked ? 'bg-error' : 'bg-warning'
              }`} />
              <span className="text-gray-600">
                {status?.remoteAccessBlocked ? 'RDP, SSH, VNC disabled' : 'Some services enabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Firewall Status</p>
                <p className={`text-2xl font-bold mt-1 ${
                  status?.firewallActive ? 'text-success' : 'text-error'
                }`}>
                  {status?.firewallActive ? 'ACTIVE' : 'INACTIVE'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                status?.firewallActive ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Flame className={`text-xl ${
                  status?.firewallActive ? 'text-success' : 'text-error'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                status?.firewallActive ? 'bg-success' : 'bg-error'
              }`} />
              <span className="text-gray-600">
                {status?.firewallActive ? 'All profiles enabled' : 'Some profiles disabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remote Services</p>
                <p className={`text-2xl font-bold mt-1 ${
                  status?.servicesStopped ? 'text-error' : 'text-success'
                }`}>
                  {status?.servicesStopped ? 'STOPPED' : 'RUNNING'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                status?.servicesStopped ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Power className={`text-xl ${
                  status?.servicesStopped ? 'text-error' : 'text-success'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                status?.servicesStopped ? 'bg-error' : 'bg-success'
              }`} />
              <span className="text-gray-600">
                {status?.servicesStopped ? '3 services disabled' : 'Services active'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className={`text-2xl font-bold mt-1 ${
                  (status?.securityScore || 0) >= 80 ? 'text-success' : 
                  (status?.securityScore || 0) >= 60 ? 'text-warning' : 'text-error'
                }`}>
                  {status?.securityScore || 0}/100
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                (status?.securityScore || 0) >= 80 ? 'bg-green-100' : 
                (status?.securityScore || 0) >= 60 ? 'bg-orange-100' : 'bg-red-100'
              }`}>
                <CheckCircle className={`text-xl ${
                  (status?.securityScore || 0) >= 80 ? 'text-success' : 
                  (status?.securityScore || 0) >= 60 ? 'text-warning' : 'text-error'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                (status?.securityScore || 0) >= 80 ? 'bg-success' : 
                (status?.securityScore || 0) >= 60 ? 'bg-warning' : 'bg-error'
              }`} />
              <span className="text-gray-600">
                {(status?.securityScore || 0) >= 80 ? 'Excellent protection' : 
                 (status?.securityScore || 0) >= 60 ? 'Good protection' : 'Needs improvement'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
