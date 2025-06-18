import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Power, Ban, RotateCcw, Bolt, Info } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

export default function ServicesTab() {
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/security/services"],
  });

  const controlMutation = useMutation({
    mutationFn: async ({ serviceId, action }: { serviceId: number; action: string }) => {
      const response = await apiRequest("POST", `/api/security/services/${serviceId}/control`, {
        action,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/logs"] });
      toast({
        title: "Service Updated",
        description: "Service status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service status.",
        variant: "destructive",
      });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (action: string) => {
      const response = await apiRequest("POST", "/api/security/services/bulk-action", {
        action,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/logs"] });
      toast({
        title: "Services Updated",
        description: "Bulk action completed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform bulk action.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Remote Services Management</h3>
          <div className="space-y-4">
            {services?.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.displayName}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <Badge variant={service.status === "running" ? "default" : "destructive"}>
                    {service.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Status: {service.status}</p>
                    <p>Startup Type: {service.startupType}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        controlMutation.mutate({
                          serviceId: service.id,
                          action: service.status === "running" ? "stop" : "start",
                        })
                      }
                      disabled={controlMutation.isPending}
                    >
                      {service.status === "running" ? "Stop" : "Start"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        controlMutation.mutate({
                          serviceId: service.id,
                          action: service.startupType === "disabled" ? "enable" : "disable",
                        })
                      }
                      disabled={controlMutation.isPending}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Control Actions</h3>
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Bolt className="text-gray-400 text-3xl mb-3 mx-auto" />
                <h4 className="font-medium text-gray-900 mb-2">Bulk Service Management</h4>
                <p className="text-sm text-gray-600">
                  Perform actions on multiple services simultaneously
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-error hover:bg-red-700 text-white"
                  onClick={() => bulkActionMutation.mutate("stop-all")}
                  disabled={bulkActionMutation.isPending}
                >
                  <Power className="w-4 h-4 mr-2" />
                  Stop All Remote Services
                </Button>
                <Button
                  className="w-full bg-warning hover:bg-orange-600 text-white"
                  onClick={() => bulkActionMutation.mutate("disable-all")}
                  disabled={bulkActionMutation.isPending}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Disable All Remote Services
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => bulkActionMutation.mutate("reset-all")}
                  disabled={bulkActionMutation.isPending}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Service Dependencies</h4>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Important Notice:</strong> Disabling remote services may affect other
                system functions. Review dependencies before making changes.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
