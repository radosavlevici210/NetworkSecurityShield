import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Ban, Unlock, Shield, ShieldCheck } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SecuritySettings, ActivityLog } from "@shared/schema";

export default function RemoteAccessTab() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SecuritySettings>({
    queryKey: ["/api/security/settings"],
  });

  const { data: logs } = useQuery<ActivityLog[]>({
    queryKey: ["/api/security/logs"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ service, enabled }: { service: string; enabled: boolean }) => {
      const response = await apiRequest("POST", "/api/security/remote-access/toggle", {
        service,
        enabled,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/logs"] });
      toast({
        title: "Remote Access Updated",
        description: "Security settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update remote access settings.",
        variant: "destructive",
      });
    },
  });

  const blockAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/security/remote-access/block-all");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/logs"] });
      toast({
        title: "All Remote Access Blocked",
        description: "All remote connection attempts are now blocked.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to block remote access.",
        variant: "destructive",
      });
    },
  });

  const recentBlocks = logs?.filter(log => 
    log.component === "Remote Access" && log.action === "BLOCKED"
  ).slice(0, 3) || [];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const services = [
    {
      key: "rdp",
      name: "Remote Desktop Protocol (RDP)",
      description: "TCP Port 3389 - Windows remote desktop access",
      enabled: settings?.rdpEnabled || false,
    },
    {
      key: "ssh",
      name: "Secure Shell (SSH)",
      description: "TCP Port 22 - Unix/Linux remote access",
      enabled: settings?.sshEnabled || false,
    },
    {
      key: "vnc",
      name: "Virtual Network Computing (VNC)",
      description: "TCP Port 5900 - Cross-platform remote desktop",
      enabled: settings?.vncEnabled || false,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Remote Connection Controls</h3>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={service.enabled ? "default" : "destructive"}>
                      {service.enabled ? "ALLOWED" : "BLOCKED"}
                    </Badge>
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={(enabled) =>
                        toggleMutation.mutate({ service: service.key, enabled })
                      }
                      disabled={toggleMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex space-x-3">
            <Button
              className="flex-1 bg-error hover:bg-red-700 text-white"
              onClick={() => blockAllMutation.mutate()}
              disabled={blockAllMutation.isPending}
            >
              <Ban className="w-4 h-4 mr-2" />
              Block All Remote Access
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                services.forEach(service => {
                  if (!service.enabled) {
                    toggleMutation.mutate({ service: service.key, enabled: true });
                  }
                });
              }}
              disabled={toggleMutation.isPending}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Allow All Remote Access
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Attempts</h3>
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-8">
                <ShieldCheck className="text-success text-4xl mb-3 mx-auto" />
                <h4 className="font-medium text-gray-900 mb-2">All Connections Blocked</h4>
                <p className="text-sm text-gray-600">
                  No unauthorized connection attempts detected in the last 24 hours
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Recent Blocked Attempts</h4>
            <div className="space-y-2">
              {recentBlocks.length > 0 ? (
                recentBlocks.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-error rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.details}
                        </p>
                        <p className="text-xs text-gray-600">
                          {log.ipAddress} • {new Date(log.timestamp!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Ban className="text-error" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Shield className="mx-auto w-8 h-8 mb-2" />
                  <p className="text-sm">No recent blocked attempts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
