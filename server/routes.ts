import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSecuritySettingsSchema, insertActivityLogSchema } from "@shared/schema";
import { spawn } from "child_process";
import { z } from "zod";

const updateServiceSchema = z.object({
  action: z.enum(["start", "stop", "enable", "disable"]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Security settings endpoints
  app.get("/api/security/settings", async (req, res) => {
    try {
      const settings = await storage.getSecuritySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security settings" });
    }
  });

  app.patch("/api/security/settings", async (req, res) => {
    try {
      const settings = insertSecuritySettingsSchema.parse(req.body);
      const updated = await storage.updateSecuritySettings(settings);
      
      // Log the activity
      await storage.createActivityLog({
        action: "UPDATED",
        component: "Security Settings",
        status: "success",
        details: "Security settings updated successfully",
      });

      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid security settings data" });
    }
  });

  // Remote access control endpoints
  app.post("/api/security/remote-access/toggle", async (req, res) => {
    try {
      const { service, enabled } = req.body;
      
      if (!["rdp", "ssh", "vnc"].includes(service)) {
        return res.status(400).json({ message: "Invalid service type" });
      }

      const settings = await storage.getSecuritySettings();
      const fieldMap = {
        rdp: "rdpEnabled",
        ssh: "sshEnabled", 
        vnc: "vncEnabled"
      };

      const updated = await storage.updateSecuritySettings({
        ...settings,
        [fieldMap[service as keyof typeof fieldMap]]: enabled,
      });

      // Execute system command (simulated for cross-platform compatibility)
      const action = enabled ? "allow" : "block";
      const ports = { rdp: 3389, ssh: 22, vnc: 5900 };
      
      await storage.createActivityLog({
        action: enabled ? "ENABLED" : "BLOCKED",
        component: "Remote Access",
        status: "success",
        details: `${service.toUpperCase()} ${action}ed on port ${ports[service as keyof typeof ports]}`,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle remote access" });
    }
  });

  app.post("/api/security/remote-access/block-all", async (req, res) => {
    try {
      const settings = await storage.getSecuritySettings();
      const updated = await storage.updateSecuritySettings({
        ...settings,
        rdpEnabled: false,
        sshEnabled: false,
        vncEnabled: false,
      });

      await storage.createActivityLog({
        action: "BLOCKED",
        component: "Remote Access",
        status: "success",
        details: "All remote access connections blocked",
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to block remote access" });
    }
  });

  // Firewall endpoints
  app.get("/api/security/firewall/rules", async (req, res) => {
    try {
      const rules = await storage.getFirewallRules();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch firewall rules" });
    }
  });

  app.post("/api/security/firewall/toggle", async (req, res) => {
    try {
      const { profile, enabled } = req.body;
      
      if (!["domain", "private", "public"].includes(profile)) {
        return res.status(400).json({ message: "Invalid firewall profile" });
      }

      const settings = await storage.getSecuritySettings();
      const fieldMap = {
        domain: "firewallDomainEnabled",
        private: "firewallPrivateEnabled",
        public: "firewallPublicEnabled"
      };

      const updated = await storage.updateSecuritySettings({
        ...settings,
        [fieldMap[profile as keyof typeof fieldMap]]: enabled,
      });

      await storage.createActivityLog({
        action: enabled ? "ENABLED" : "DISABLED",
        component: "Firewall",
        status: "success",
        details: `${profile} firewall profile ${enabled ? "enabled" : "disabled"}`,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle firewall" });
    }
  });

  // Services endpoints
  app.get("/api/security/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/security/services/:id/control", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const { action } = updateServiceSchema.parse(req.body);

      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      let newStatus = service.status;
      let newStartupType = service.startupType;

      switch (action) {
        case "start":
          newStatus = "running";
          break;
        case "stop":
          newStatus = "stopped";
          break;
        case "enable":
          newStartupType = "automatic";
          break;
        case "disable":
          newStatus = "stopped";
          newStartupType = "disabled";
          break;
      }

      const updated = await storage.updateService(serviceId, {
        status: newStatus,
        startupType: newStartupType,
      });

      await storage.createActivityLog({
        action: action.toUpperCase(),
        component: "Service",
        status: "success",
        details: `${service.displayName} ${action}ed successfully`,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to control service" });
    }
  });

  app.post("/api/security/services/bulk-action", async (req, res) => {
    try {
      const { action } = req.body;
      
      if (!["stop-all", "disable-all", "reset-all"].includes(action)) {
        return res.status(400).json({ message: "Invalid bulk action" });
      }

      const services = await storage.getServices();
      const updatedServices = [];

      for (const service of services) {
        let newStatus = service.status;
        let newStartupType = service.startupType;

        switch (action) {
          case "stop-all":
            newStatus = "stopped";
            break;
          case "disable-all":
            newStatus = "stopped";
            newStartupType = "disabled";
            break;
          case "reset-all":
            newStatus = "stopped";
            newStartupType = "disabled";
            break;
        }

        const updated = await storage.updateService(service.id, {
          status: newStatus,
          startupType: newStartupType,
        });
        updatedServices.push(updated);
      }

      await storage.createActivityLog({
        action: action.toUpperCase().replace("-", "_"),
        component: "Services",
        status: "success",
        details: `Bulk action ${action} applied to all remote services`,
      });

      res.json(updatedServices);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform bulk action" });
    }
  });

  // Activity logs endpoints
  app.get("/api/security/logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const logs = await storage.getActivityLogs(limit, offset);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // System status endpoint
  app.get("/api/security/status", async (req, res) => {
    try {
      const settings = await storage.getSecuritySettings();
      const services = await storage.getServices();
      const rules = await storage.getFirewallRules();

      const remoteAccessBlocked = !settings.rdpEnabled && !settings.sshEnabled && !settings.vncEnabled;
      const firewallActive = settings.firewallDomainEnabled && settings.firewallPrivateEnabled && settings.firewallPublicEnabled;
      const servicesStopped = services.every(s => s.status === "stopped");
      const activeBlockRules = rules.filter(r => r.action === "block" && r.isActive).length;

      let securityScore = 0;
      if (remoteAccessBlocked) securityScore += 30;
      if (firewallActive) securityScore += 25;
      if (servicesStopped) securityScore += 20;
      securityScore += Math.min(activeBlockRules * 5, 25);

      res.json({
        remoteAccessBlocked,
        firewallActive,
        servicesStopped,
        securityScore,
        activeBlockRules,
        systemOnline: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
