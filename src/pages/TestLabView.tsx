import React, { useState } from 'react';
import { REQUIRED_TEST_CASES, runAllTestCases, runTestCase } from '../services/testSuite';
import { TestCase, TestResult, StudentConfig } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plane
} from 'lucide-react';

interface TestLabViewProps {
  config: StudentConfig;
}

export const TestLabView: React.FC<TestLabViewProps> = ({ config }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<number, TestResult>>({});
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  // Compute test suite summary
  const resultsList = Object.values(testResults);
  const totalRan = resultsList.length;
  const passedCount = resultsList.filter(r => r.passed).length;
  const failedCount = totalRan - passedCount;
  const allRequiredRan = REQUIRED_TEST_CASES.every(tc => testResults[tc.id]);

  const handleRunAll = () => {
    setIsRunning(true);
    // Micro-delay to simulate engine processing visually
    setTimeout(() => {
      const report = runAllTestCases(REQUIRED_TEST_CASES);
      const resultMap: Record<number, TestResult> = {};
      report.results.forEach(r => {
        resultMap[r.testCaseId] = r;
      });
      setTestResults(resultMap);
      setIsRunning(false);
    }, 250);
  };

  const handleRunSingle = (tc: TestCase) => {
    const res = runTestCase(tc);
    setTestResults(prev => ({ ...prev, [tc.id]: res }));
  };

  const handleResetTests = () => {
    setTestResults({});
  };

  return (
    <div className="space-y-6">
      {/* Header & Run Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-sky-400" />
            Airline Security Rules Test Lab (6 Academic Scenarios)
          </h2>
          <p className="text-xs text-slate-400">
            Automated verification suite validating the real deterministic decision engine against airline passenger service requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {totalRan > 0 && (
            <button
              onClick={handleResetTests}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Results
            </button>
          )}

          <button
            onClick={handleRunAll}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2"
          >
            <Play className={`w-4 h-4 fill-white ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Executing Real Engine...' : 'Run All Test Cases'}
          </button>
        </div>
      </div>

      {/* Summary Scorecard Banner */}
      <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-xs mb-1">Required Academic Tests</span>
            <span className="text-xl font-bold font-mono text-white">6 / 6 Defined</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">+ 2 Airline Edge Tests</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-xs mb-1">Executed Status</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {totalRan} / {REQUIRED_TEST_CASES.length} Ran
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {allRequiredRan ? 'Full airline suite verified' : 'Ready to execute'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-xs mb-1">Passed Tests</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {passedCount}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {totalRan > 0 ? `${Math.round((passedCount / totalRan) * 100)}% Pass Rate` : 'No runs yet'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-xs mb-1">Failed Tests</span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {failedCount}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {failedCount === 0 && totalRan > 0 ? 'Zero failures ✅' : 'None detected'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Airline Test Scenarios Matrix
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Environment: Local Deterministic Engine
          </span>
        </div>

        {REQUIRED_TEST_CASES.map((tc) => {
          const result = testResults[tc.id];
          const isExpanded = expandedTestId === tc.id;
          const isAcademicMandatory = tc.id <= 6;

          return (
            <div
              key={tc.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                result
                  ? result.passed
                    ? 'bg-[#111827] border-emerald-900/40 hover:border-emerald-700/60'
                    : 'bg-[#111827] border-rose-900/60'
                  : 'bg-[#111827] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Summary Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 font-mono font-bold text-xs ${
                    result
                      ? result.passed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    #{tc.id}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{tc.title}</h4>
                      {isAcademicMandatory && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-semibold border border-sky-500/20">
                          Mandatory Academic Test
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {tc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {tc.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Expected vs Actual Badges & Run Button */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                      Expected Verdict
                    </div>
                    <DecisionBadge decision={tc.expectedDecision} size="sm" />
                  </div>

                  {result && (
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        Actual Verdict
                      </div>
                      <DecisionBadge decision={result.actualDecision} size="sm" />
                    </div>
                  )}

                  {/* Pass / Fail Status Badge */}
                  {result ? (
                    <div className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 border ${
                      result.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {result.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRunSingle(tc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      Run Test
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedTestId(isExpanded ? null : tc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Toggle Test Setup Details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Inspection Drawer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-900/60 space-y-3 text-xs animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">
                        Target Agent Fixture
                      </span>
                      <div className="font-mono text-sky-400 font-bold">{tc.setup.agentId}</div>
                      <div className="text-[11px] text-slate-400">Status: {tc.setup.agentStatus}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">
                        Flight Action & Parameters
                      </span>
                      <div className="font-mono text-slate-200 uppercase font-bold">{tc.setup.action || 'EMPTY'}</div>
                      <div className="text-[11px] text-amber-400 font-mono">
                        Fare: {tc.setup.amount > 0 ? `${config.currency} ${tc.setup.amount.toLocaleString()}` : '0 (Read-Only)'}
                      </div>
                      {tc.setup.route && (
                        <div className="text-[10px] text-sky-300 font-mono mt-0.5">{tc.setup.route}</div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">
                        Expected Airline Rule
                      </span>
                      <div className="font-bold text-white">Rule #{tc.expectedRuleNumber}</div>
                      <div className="text-[11px] text-slate-400 truncate">{tc.expectedRuleName}</div>
                    </div>
                  </div>

                  {result && (
                    <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-1">
                      <div className="flex items-center justify-between text-sky-300 font-mono text-[11px]">
                        <span>Engine Execution Duration: {result.executionTimeMs} ms</span>
                        <span>Executed at: {new Date(result.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300 text-xs">
                        <strong>Airline Engine Verdict:</strong> {result.actualExplanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
