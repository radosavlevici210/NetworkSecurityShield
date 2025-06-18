import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ActivityLog } from "@shared/schema";

export default function ActivityLogsTab() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const logsPerPage = 10;

  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/security/logs"],
  });

  const filteredLogs = logs?.filter(log => {
    if (filter === "all") return true;
    if (filter === "firewall") return log.component === "Firewall";
    if (filter === "services") return log.component === "Service" || log.component === "Services";
    if (filter === "connections") return log.component === "Remote Access";
    return true;
  }) || [];

  const paginatedLogs = filteredLogs.slice(
    currentPage * logsPerPage,
    (currentPage + 1) * logsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "error":
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants = {
      BLOCKED: "destructive",
      ENABLED: "default",
      DISABLED: "secondary",
      STOPPED: "destructive",
      STARTED: "default",
      UPDATED: "default",
    } as const;

    return (
      <Badge variant={variants[action as keyof typeof variants] || "secondary"}>
        {action}
      </Badge>
    );
  };

  const exportLogs = () => {
    const csvContent = [
      "Timestamp,Action,Component,Status,Details",
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.action}","${log.component}","${log.status}","${log.details}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Security Activity Logs</h3>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="firewall">Firewall Changes</SelectItem>
              <SelectItem value="services">Service Changes</SelectItem>
              <SelectItem value="connections">Connection Attempts</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.timestamp!).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>{log.component}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <span className="text-sm capitalize">{log.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing {paginatedLogs.length} of {filteredLogs.length} activities
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
