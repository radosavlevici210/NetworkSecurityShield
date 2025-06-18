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
