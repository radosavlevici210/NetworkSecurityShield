import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SecuritySettings, FirewallRule } from "@shared/schema";

export default function FirewallTab() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SecuritySettings>({
    queryKey: ["/api/security/settings"],
  });

  const { data: rules } = useQuery<FirewallRule[]>({
    queryKey: ["/api/security/firewall/rules"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ profile, enabled }: { profile: string; enabled: boolean }) => {
      const response = await apiRequest("POST", "/api/security/firewall/toggle", {
        profile,
        enabled,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/logs"] });
      toast({
        title: "Firewall Updated",
        description: "Firewall settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update firewall settings.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const profiles = [
    {
      key: "domain",
      name: "Domain Profile",
      description: "Applied when connected to domain networks",
      enabled: settings?.firewallDomainEnabled || false,
    },
    {
      key: "private",
      name: "Private Profile",
      description: "Applied when connected to private networks",
      enabled: settings?.firewallPrivateEnabled || false,
    },
    {
      key: "public",
      name: "Public Profile",
      description: "Applied when connected to public networks",
      enabled: settings?.firewallPublicEnabled || false,
    },
  ];

  const blockRules = rules?.filter(rule => rule.action === "block" && rule.isActive) || [];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Firewall Profiles</h3>
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div key={profile.key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{profile.name}</h4>
                    <p className="text-sm text-gray-600">{profile.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={profile.enabled ? "default" : "destructive"}>
                      {profile.enabled ? "ENABLED" : "DISABLED"}
                    </Badge>
                    <Switch
                      checked={profile.enabled}
                      onCheckedChange={(enabled) =>
                        toggleMutation.mutate({ profile: profile.key, enabled })
                      }
                      disabled={toggleMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Firewall Rules</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Block Rules</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {blockRules.map((rule) => (
                  <div key={rule.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{rule.name}</p>
                      <p className="text-sm text-gray-600">
                        Port {rule.port} • {rule.direction} • {rule.protocol.toUpperCase()}
                      </p>
                    </div>
                    <Badge variant="destructive">ACTIVE</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
