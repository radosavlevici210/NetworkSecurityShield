import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const securitySettings = pgTable("security_settings", {
  id: serial("id").primaryKey(),
  rdpEnabled: boolean("rdp_enabled").default(false),
  sshEnabled: boolean("ssh_enabled").default(false),
  vncEnabled: boolean("vnc_enabled").default(false),
  firewallDomainEnabled: boolean("firewall_domain_enabled").default(true),
  firewallPrivateEnabled: boolean("firewall_private_enabled").default(true),
  firewallPublicEnabled: boolean("firewall_public_enabled").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // "running", "stopped", "disabled"
  startupType: text("startup_type").notNull(), // "automatic", "manual", "disabled"
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  action: text("action").notNull(),
  component: text("component").notNull(),
  status: text("status").notNull(), // "success", "error"
  details: text("details").notNull(),
  ipAddress: text("ip_address"),
});

export const firewallRules = pgTable("firewall_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  port: integer("port").notNull(),
  protocol: text("protocol").notNull(), // "tcp", "udp"
  direction: text("direction").notNull(), // "inbound", "outbound"
  action: text("action").notNull(), // "allow", "block"
  isActive: boolean("is_active").default(true),
});

export const threatDetections = pgTable("threat_detections", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  threatType: text("threat_type").notNull(), // "brute_force", "port_scan", "suspicious_ip", "malware"
  sourceIp: text("source_ip").notNull(),
  targetPort: integer("target_port"),
  severity: text("severity").notNull(), // "low", "medium", "high", "critical"
  description: text("description").notNull(),
  isBlocked: boolean("is_blocked").default(true),
  geoLocation: text("geo_location"),
});

export const networkMonitoring = pgTable("network_monitoring", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  connectionType: text("connection_type").notNull(), // "incoming", "outgoing"
  sourceIp: text("source_ip").notNull(),
  destinationIp: text("destination_ip").notNull(),
  port: integer("port").notNull(),
  protocol: text("protocol").notNull(),
  dataTransferred: integer("data_transferred").default(0), // bytes
  duration: integer("duration").default(0), // seconds
  status: text("status").notNull(), // "allowed", "blocked", "monitored"
});

export const securityPolicies = pgTable("security_policies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  policyType: text("policy_type").notNull(), // "access_control", "threat_prevention", "compliance"
  isEnabled: boolean("is_enabled").default(true),
  rules: text("rules").notNull(), // JSON string of policy rules
  lastModified: timestamp("last_modified").defaultNow(),
});

export const systemHealth = pgTable("system_health", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  cpuUsage: integer("cpu_usage").notNull(), // percentage
  memoryUsage: integer("memory_usage").notNull(), // percentage
  diskUsage: integer("disk_usage").notNull(), // percentage
  networkLatency: integer("network_latency").notNull(), // milliseconds
  activeConnections: integer("active_connections").default(0),
  securityStatus: text("security_status").notNull(), // "secure", "warning", "critical"
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSecuritySettingsSchema = createInsertSchema(securitySettings).omit({
  id: true,
  lastUpdated: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertFirewallRuleSchema = createInsertSchema(firewallRules).omit({
  id: true,
});

export const insertThreatDetectionSchema = createInsertSchema(threatDetections).omit({
  id: true,
  timestamp: true,
});

export const insertNetworkMonitoringSchema = createInsertSchema(networkMonitoring).omit({
  id: true,
  timestamp: true,
});

export const insertSecurityPolicySchema = createInsertSchema(securityPolicies).omit({
  id: true,
  lastModified: true,
});

export const insertSystemHealthSchema = createInsertSchema(systemHealth).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SecuritySettings = typeof securitySettings.$inferSelect;
export type InsertSecuritySettings = z.infer<typeof insertSecuritySettingsSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type FirewallRule = typeof firewallRules.$inferSelect;
export type InsertFirewallRule = z.infer<typeof insertFirewallRuleSchema>;
export type ThreatDetection = typeof threatDetections.$inferSelect;
export type InsertThreatDetection = z.infer<typeof insertThreatDetectionSchema>;
export type NetworkMonitoring = typeof networkMonitoring.$inferSelect;
export type InsertNetworkMonitoring = z.infer<typeof insertNetworkMonitoringSchema>;
export type SecurityPolicy = typeof securityPolicies.$inferSelect;
export type InsertSecurityPolicy = z.infer<typeof insertSecurityPolicySchema>;
export type SystemHealth = typeof systemHealth.$inferSelect;
export type InsertSystemHealth = z.infer<typeof insertSystemHealthSchema>;
