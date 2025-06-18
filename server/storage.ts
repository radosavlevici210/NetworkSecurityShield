import { 
  users, 
  securitySettings,
  services,
  activityLogs,
  firewallRules,
  threatDetections,
  networkMonitoring,
  securityPolicies,
  systemHealth,
  type User, 
  type InsertUser,
  type SecuritySettings,
  type InsertSecuritySettings,
  type Service,
  type InsertService,
  type ActivityLog,
  type InsertActivityLog,
  type FirewallRule,
  type InsertFirewallRule,
  type ThreatDetection,
  type InsertThreatDetection,
  type NetworkMonitoring,
  type InsertNetworkMonitoring,
  type SecurityPolicy,
  type InsertSecurityPolicy,
  type SystemHealth,
  type InsertSystemHealth
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSecuritySettings(): Promise<SecuritySettings>;
  updateSecuritySettings(settings: InsertSecuritySettings): Promise<SecuritySettings>;
  
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  updateService(id: number, service: Partial<Service>): Promise<Service>;
  
  getActivityLogs(limit?: number, offset?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  getFirewallRules(): Promise<FirewallRule[]>;
  createFirewallRule(rule: InsertFirewallRule): Promise<FirewallRule>;
  updateFirewallRule(id: number, rule: Partial<FirewallRule>): Promise<FirewallRule>;
  deleteFirewallRule(id: number): Promise<void>;
  
  getThreatDetections(limit?: number, offset?: number): Promise<ThreatDetection[]>;
  createThreatDetection(threat: InsertThreatDetection): Promise<ThreatDetection>;
  
  getNetworkMonitoring(limit?: number, offset?: number): Promise<NetworkMonitoring[]>;
  createNetworkMonitoring(monitoring: InsertNetworkMonitoring): Promise<NetworkMonitoring>;
  
  getSecurityPolicies(): Promise<SecurityPolicy[]>;
  createSecurityPolicy(policy: InsertSecurityPolicy): Promise<SecurityPolicy>;
  updateSecurityPolicy(id: number, policy: Partial<SecurityPolicy>): Promise<SecurityPolicy>;
  deleteSecurityPolicy(id: number): Promise<void>;
  
  getSystemHealth(): Promise<SystemHealth[]>;
  createSystemHealth(health: InsertSystemHealth): Promise<SystemHealth>;
  getLatestSystemHealth(): Promise<SystemHealth | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private securitySettingsData: SecuritySettings;
  private servicesData: Map<number, Service>;
  private activityLogsData: Map<number, ActivityLog>;
  private firewallRulesData: Map<number, FirewallRule>;
  private threatDetectionsData: Map<number, ThreatDetection>;
  private networkMonitoringData: Map<number, NetworkMonitoring>;
  private securityPoliciesData: Map<number, SecurityPolicy>;
  private systemHealthData: Map<number, SystemHealth>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.servicesData = new Map();
    this.activityLogsData = new Map();
    this.firewallRulesData = new Map();
    this.threatDetectionsData = new Map();
    this.networkMonitoringData = new Map();
    this.securityPoliciesData = new Map();
    this.systemHealthData = new Map();
    this.currentId = 1;
    
    // Initialize default security settings
    this.securitySettingsData = {
      id: 1,
      rdpEnabled: false,
      sshEnabled: false,
      vncEnabled: false,
      firewallDomainEnabled: true,
      firewallPrivateEnabled: true,
      firewallPublicEnabled: true,
      lastUpdated: new Date(),
    };

    // Initialize default services
    this.initializeDefaultServices();
    this.initializeDefaultFirewallRules();
  }

  private initializeDefaultServices() {
    const defaultServices: Service[] = [
      {
        id: 1,
        name: "TermService",
        displayName: "Terminal Services",
        description: "Remote Desktop Protocol service",
        status: "stopped",
        startupType: "disabled",
      },
      {
        id: 2,
        name: "RemoteRegistry",
        displayName: "Remote Registry",
        description: "Remote registry access service",
        status: "stopped",
        startupType: "disabled",
      },
      {
        id: 3,
        name: "RasMan",
        displayName: "Remote Access Manager",
        description: "VPN and dial-up connection manager",
        status: "stopped",
        startupType: "disabled",
      },
    ];

    defaultServices.forEach(service => {
      this.servicesData.set(service.id, service);
    });
  }

  private initializeDefaultFirewallRules() {
    const defaultRules: FirewallRule[] = [
      {
        id: 1,
        name: "Block RDP TCP",
        port: 3389,
        protocol: "tcp",
        direction: "inbound",
        action: "block",
        isActive: true,
      },
      {
        id: 2,
        name: "Block RDP UDP",
        port: 3389,
        protocol: "udp",
        direction: "inbound",
        action: "block",
        isActive: true,
      },
      {
        id: 3,
        name: "Block SSH",
        port: 22,
        protocol: "tcp",
        direction: "inbound",
        action: "block",
        isActive: true,
      },
      {
        id: 4,
        name: "Block VNC",
        port: 5900,
        protocol: "tcp",
        direction: "inbound",
        action: "block",
        isActive: true,
      },
    ];

    defaultRules.forEach(rule => {
      this.firewallRulesData.set(rule.id, rule);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    return this.securitySettingsData;
  }

  async updateSecuritySettings(settings: InsertSecuritySettings): Promise<SecuritySettings> {
    this.securitySettingsData = {
      ...this.securitySettingsData,
      ...settings,
      lastUpdated: new Date(),
    };
    return this.securitySettingsData;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.servicesData.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.servicesData.get(id);
  }

  async updateService(id: number, service: Partial<Service>): Promise<Service> {
    const existing = this.servicesData.get(id);
    if (!existing) {
      throw new Error(`Service with id ${id} not found`);
    }
    const updated = { ...existing, ...service };
    this.servicesData.set(id, updated);
    return updated;
  }

  async getActivityLogs(limit = 50, offset = 0): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogsData.values())
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())
      .slice(offset, offset + limit);
    return logs;
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentId++;
    const activityLog: ActivityLog = {
      ...log,
      id,
      timestamp: new Date(),
    };
    this.activityLogsData.set(id, activityLog);
    return activityLog;
  }

  async getFirewallRules(): Promise<FirewallRule[]> {
    return Array.from(this.firewallRulesData.values());
  }

  async createFirewallRule(rule: InsertFirewallRule): Promise<FirewallRule> {
    const id = this.currentId++;
    const firewallRule: FirewallRule = { ...rule, id };
    this.firewallRulesData.set(id, firewallRule);
    return firewallRule;
  }

  async updateFirewallRule(id: number, rule: Partial<FirewallRule>): Promise<FirewallRule> {
    const existing = this.firewallRulesData.get(id);
    if (!existing) {
      throw new Error(`Firewall rule with id ${id} not found`);
    }
    const updated = { ...existing, ...rule };
    this.firewallRulesData.set(id, updated);
    return updated;
  }

  async deleteFirewallRule(id: number): Promise<void> {
    this.firewallRulesData.delete(id);
  }
}

export const storage = new MemStorage();
