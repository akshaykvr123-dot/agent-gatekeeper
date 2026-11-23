import React, { useState } from 'react';
import { 
  AIAgent, 
  AuditLogEntry, 
  PendingApproval, 
  SecurityRule, 
  StudentConfig 
} from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { RegisterAgentModal } from './components/RegisterAgentModal';
import { RevocationModal } from './components/RevocationModal';
import { AuditDetailModal } from './components/AuditDetailModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { RequestGatekeeper } from './pages/RequestGatekeeper';
import { AgentRegistry } from './pages/AgentRegistry';
import { RevocationHub } from './pages/RevocationHub';
import { AuditLogView } from './pages/AuditLogView';
import { SecurityRulesView } from './pages/SecurityRulesView';
import { CustomerApprovalView } from './pages/CustomerApprovalView';
import { TestLabView } from './pages/TestLabView';
import { DocsView } from './pages/DocsView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [config, setConfig] = useState<StudentConfig>(storage.getConfig());
  const [agents, setAgents] = useState<AIAgent[]>(storage.getAgents());
  const [rules, setRules] = useState<SecurityRule[]>(storage.getRules());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(storage.getAuditLogs());
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(storage.getPendingApprovals());

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [agentToRevoke, setAgentToRevoke] = useState<AIAgent | null>(null);
  const [inspectedAuditEntry, setInspectedAuditEntry] = useState<AuditLogEntry | null>(null);

  // Sync state helper
  const refreshAllState = () => {
    setConfig(storage.getConfig());
    setAgents(storage.getAgents());
    setRules(storage.getRules());
    setAuditLogs(storage.getAuditLogs());
    setPendingApprovals(storage.getPendingApprovals());
  };

  const handleSaveConfig = (newConfig: StudentConfig) => {
    storage.saveConfig(newConfig);
    setConfig(newConfig);
    setRules(storage.getRules(newConfig.industry));
    refreshAllState();
  };

  const handleResetDemoData = () => {
    storage.resetToDemoData();
    refreshAllState();
  };

  const handleRegisterAgent = (newAgent: AIAgent) => {
    storage.addAgent(newAgent);
    storage.addAuditLog({
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      eventType: 'AGENT_REGISTERED',
      customerId: newAgent.customerId,
      agentId: newAgent.id,
      agentName: newAgent.name,
      action: 'register_agent',
      amount: 0,
      currency: config.currency,
      decision: 'ALLOW',
      ruleNumber: 1,
      ruleName: 'AI Travel Agent Registered into Registry',
      reason: `Agent '${newAgent.name}' authorized for flight permissions: [${newAgent.permissions.join(', ')}]`,
      description: `Registration completed for ${newAgent.provider} under passenger account ${newAgent.customerId}`,
      status: 'COMPLETED',
    });
    refreshAllState();
  };

  const handleRevokeAgent = (agentId: string, revokedBy: string, reason: string) => {
    storage.revokeAgent(agentId, revokedBy, reason);
    refreshAllState();
  };

  const handleUpdateAgent = (agent: AIAgent) => {
    storage.updateAgent(agent);
    refreshAllState();
  };

  const handleResolveApproval = (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    resolvedBy: string,
    notes?: string
  ) => {
    storage.resolvePendingApproval(id, status, resolvedBy, notes);
    refreshAllState();
  };

  const handleUpdateRules = (updatedRules: SecurityRule[]) => {
    storage.saveRules(updatedRules, config.industry);
    setRules(updatedRules);
  };

  const handleUpdateThreshold = (threshold: number) => {
    const updated = { ...config, transactionThreshold: threshold };
    storage.saveConfig(updated);
    setConfig(updated);
  };

  const pendingCount = pendingApprovals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top App Header */}
      <Header
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetDemoData={handleResetDemoData}
        pendingApprovalsCount={pendingCount}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={pendingCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              config={config}
              agents={agents}
              auditLogs={auditLogs}
              pendingApprovals={pendingApprovals}
              onNavigate={setActiveTab}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'gatekeeper' && (
            <RequestGatekeeper
              config={config}
              agents={agents}
              onRequestProcessed={refreshAllState}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'registry' && (
            <AgentRegistry
              agents={agents}
              industry={config.industry}
              onOpenRegisterModal={() => setIsRegisterOpen(true)}
              onOpenRevokeModal={(agt) => setAgentToRevoke(agt)}
              onUpdateAgent={handleUpdateAgent}
            />
          )}

          {activeTab === 'revoke' && (
            <RevocationHub
              agents={agents}
              onOpenRevokeModal={(agt) => setAgentToRevoke(agt)}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogView
              logs={auditLogs}
              onSelectEntry={(entry) => setInspectedAuditEntry(entry)}
              onClearLogs={() => {
                storage.clearAllData();
                refreshAllState();
              }}
            />
          )}

          {activeTab === 'rules' && (
            <SecurityRulesView
              rules={rules}
              config={config}
              onUpdateRules={handleUpdateRules}
              onUpdateThreshold={handleUpdateThreshold}
            />
          )}

          {activeTab === 'approvals' && (
            <CustomerApprovalView
              approvals={pendingApprovals}
              config={config}
              onResolve={handleResolveApproval}
            />
          )}

          {activeTab === 'testlab' && (
            <TestLabView config={config} />
          )}

          {activeTab === 'docs' && (
            <DocsView config={config} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] px-6 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Agent Gatekeeper</span>
          <span>·</span>
          <span>Student: <strong className="text-slate-300">{config.studentName}</strong></span>
          <span>·</span>
          <span>Enrolment: <strong className="font-mono text-sky-400">{config.enrolmentNumber}</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Carrier: {config.companyName} ({config.industry})</span>
          <span>Booking Limit: {config.currency} {config.transactionThreshold.toLocaleString()}</span>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-sky-400 hover:text-sky-300 underline"
          >
            Config
          </button>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      <RegisterAgentModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterAgent}
        industry={config.industry}
      />

      <RevocationModal
        isOpen={!!agentToRevoke}
        agent={agentToRevoke}
        onClose={() => setAgentToRevoke(null)}
        onConfirm={handleRevokeAgent}
      />

      <AuditDetailModal
        entry={inspectedAuditEntry}
        onClose={() => setInspectedAuditEntry(null)}
      />
    </div>
  );
};

export default App;
