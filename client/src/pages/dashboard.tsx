import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Monitor, Flame, Cog, FileText } from "lucide-react";
import AppHeader from "@/components/app-header";
import SecurityOverview from "@/components/security-overview";
import RemoteAccessTab from "@/components/remote-access-tab";
import FirewallTab from "@/components/firewall-tab";
import ServicesTab from "@/components/services-tab";
import ActivityLogsTab from "@/components/activity-logs-tab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("remote");

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SecurityOverview />

        <Card className="overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="remote" 
                  className="flex items-center space-x-2 py-4 px-6 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Remote Access</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="firewall" 
                  className="flex items-center space-x-2 py-4 px-6 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                >
                  <Flame className="w-4 h-4" />
                  <span>Firewall</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="flex items-center space-x-2 py-4 px-6 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                >
                  <Cog className="w-4 h-4" />
                  <span>Services</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="logs" 
                  className="flex items-center space-x-2 py-4 px-6 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                >
                  <FileText className="w-4 h-4" />
                  <span>Activity Logs</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="remote" className="m-0">
              <RemoteAccessTab />
            </TabsContent>

            <TabsContent value="firewall" className="m-0">
              <FirewallTab />
            </TabsContent>

            <TabsContent value="services" className="m-0">
              <ServicesTab />
            </TabsContent>

            <TabsContent value="logs" className="m-0">
              <ActivityLogsTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
