export interface SecurityStatus {
  remoteAccessBlocked: boolean;
  firewallActive: boolean;
  servicesStopped: boolean;
  securityScore: number;
  activeBlockRules: number;
  systemOnline: boolean;
}

export interface ConnectionAttempt {
  id: string;
  service: string;
  ipAddress: string;
  timestamp: Date;
  status: 'blocked' | 'allowed';
}
