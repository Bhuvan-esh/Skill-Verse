'use client';

import React, { useState, useEffect } from 'react';
import {
  Award, Sparkles, Plus, Trash2, Save, Send, CheckCircle2,
  AlertTriangle, Trophy, TrendingUp, Search, RefreshCw, FileSpreadsheet,
  Zap, Code2, Clock, Check, X, ShieldAlert, ChevronRight, HelpCircle,
  UserPlus, Layers
} from 'lucide-react';

interface MentorCodingJudgeDeckProps {
  user?: any;
  onBack?: () => void;
}

export default function MentorCodingJudgeDeck({ user, onBack }: MentorCodingJudgeDeckProps) {
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'top_performers' | 'weak_performers'>('spreadsheet');
  const [judgeRows, setJudgeRows] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [weakPerformers, setWeakPerformers] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalEvaluated: 0,
    submittedToArchitectsCount: 0,
    pendingSubmissionCount: 0,
    avgAccuracy: '0.0%',
    avgExecutionTime: '0.00ms',
  });
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJudgeDeck = async () => {
    try {
      const res = await fetch('/api/coding/judge-deck');
      const data = await res.json();
      if (data.success) {
        setJudgeRows(data.judgeRows || []);
        setTopPerformers(data.topPerformers || []);
        setWeakPerformers(data.weakPerformers || []);
        setSummary(data.summary || {
          totalEvaluated: 0,
          submittedToArchitectsCount: 0,
          pendingSubmissionCount: 0,
          avgAccuracy: '0.0%',
          avgExecutionTime: '0.00ms',
        });
      }
    } catch (err) {
      console.warn('Failed to load judge deck data:', err);
    }
  };

  useEffect(() => {
    fetchJudgeDeck();
  }, []);

  const handleCellChange = (id: string, field: string, value: any) => {
    setJudgeRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          // Recalculate total score if numerical scoring fields changed
          const cleanliness = Number(updated.code_cleanliness) || 0;
          const complexity = Number(updated.time_complexity_score) || 0;
          const memory = Number(updated.memory_score) || 0;
          const bonus = Number(updated.bonus_points) || 0;
          const accuracyPoints = Math.round((Number(updated.test_accuracy) || 0) * 1.1);
          updated.total_score = cleanliness + complexity + memory + bonus + accuracyPoints;

          if (updated.test_accuracy >= 80) {
            updated.verdict = 'QUALIFIED_TOP_PERFORMER';
          } else if (updated.test_accuracy >= 50) {
            updated.verdict = 'AVERAGE_PASS';
          } else {
            updated.verdict = 'NEEDS_ATTENTION_FAIL';
          }
          return updated;
        }
        return row;
      })
    );
  };

  const handleAddRow = () => {
    const newRow = {
      id: 'eval-' + Date.now(),
      student_name: '',
      usn: '',
      department: 'Computer Science & Engineering',
      event_name: 'Algorithmic Sprint 2026 · Concurrency',
      test_accuracy: 100,
      execution_time_ms: 1.2,
      code_cleanliness: 25,
      time_complexity_score: 25,
      memory_score: 25,
      bonus_points: 10,
      total_score: 195,
      verdict: 'QUALIFIED_TOP_PERFORMER',
      mentor_notes: '',
      submitted_to_architects: false,
    };
    setJudgeRows((prev) => [newRow, ...prev]);
  };

  const handleDeleteRow = (id: string) => {
    setJudgeRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddCustomColumn = () => {
    if (newColumnName.trim() && !customColumns.includes(newColumnName.trim())) {
      setCustomColumns([...customColumns, newColumnName.trim()]);
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const res = await fetch('/api/coding/judge-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_ALL_ROWS', judgeRows }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: 'success', text: 'Spreadsheet draft saved successfully!' });
        setTimeout(() => setActionMessage(null), 3500);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Failed to save spreadsheet draft: ' + err.message });
    }
  };

  const handleSubmitToVisualArchitects = async () => {
    if (judgeRows.length === 0) {
      setActionMessage({ type: 'error', text: 'Spreadsheet is empty! Add at least one participant before submitting to Visual Architects.' });
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/coding/judge-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_TO_VISUAL_ARCHITECTS', judgeRows }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({
          type: 'success',
          text: 'Official Judge Verdicts & Spreadsheet Scores successfully transmitted to Visual Architects! Leaderboard updated.',
        });
        fetchJudgeDeck();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Error submitting verdicts: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRows = judgeRows.filter(
    (r) =>
      r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Console */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest">
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
              <span>Mentor Judge Deck & Evaluation Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Coding Challenge Spreadsheet & Verdict Station
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Interactive Excel-style scoring grid. Add participants, customize columns, evaluate telemetry, and submit official verdicts to Visual Architects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={handleSubmitToVisualArchitects}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Submit to Visual Architects 🚀'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-6 mt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('spreadsheet')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'spreadsheet'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-300" />
            <span>📊 Excel Judge Spreadsheet ({judgeRows.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('top_performers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'top_performers'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>🏆 Top Performers Leaderboard ({topPerformers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('weak_performers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'weak_performers'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>⚠️ Needs Attention & Weak Diagnostics ({weakPerformers.length})</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono font-bold animate-in fade-in duration-200 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. EXCEL SPREADSHEET JUDGE STATION                                        */}
      {/* ========================================================================= */}
      {activeTab === 'spreadsheet' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-slate-900/60 text-center">
              <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">Total Evaluated</span>
              <p className="text-2xl font-extrabold text-white font-heading">{judgeRows.length}</p>
              <span className="text-[10px] text-purple-200/80 font-mono">Participants in Matrix</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-slate-900/60 text-center">
              <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold block">Sent to Architects</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-heading">
                {judgeRows.filter((r) => r.submitted_to_architects).length} / {judgeRows.length}
              </p>
              <span className="text-[10px] text-emerald-200/80 font-mono">Official Transmissions</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-slate-900/60 text-center">
              <span className="text-[10px] uppercase font-mono text-cyan-300 font-bold block">Avg Test Accuracy</span>
              <p className="text-2xl font-extrabold text-cyan-300 font-heading">{summary.avgAccuracy}</p>
              <span className="text-[10px] text-cyan-200/80 font-mono">Assertion Pass Rate</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-slate-900/60 text-center">
              <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">Avg Execution Speed</span>
              <p className="text-2xl font-extrabold text-amber-300 font-heading">{summary.avgExecutionTime}</p>
              <span className="text-[10px] text-amber-200/80 font-mono">Sub-Millisecond Target</span>
            </div>
          </div>

          {/* Table Controls (Search, Add Row, Add Column) */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search participant, USN, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {isAddingColumn ? (
                <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-purple-500/40">
                  <input
                    type="text"
                    placeholder="Column name..."
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="bg-transparent border-none text-xs text-white px-2 py-1 focus:outline-none font-mono w-32"
                  />
                  <button
                    onClick={handleAddCustomColumn}
                    className="p-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsAddingColumn(false)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
              )}

              <button
                onClick={handleAddRow}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-xs font-mono font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Participant Row</span>
              </button>
            </div>
          </div>

          {/* Interactive Excel Sheet Table */}
          <div className="glass-panel rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl overflow-hidden">
            {judgeRows.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <UserPlus className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white font-heading">
                    Spreadsheet Ready For Evaluation
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    No participants added to the judge deck yet. Click the button below to insert participant rows and enter their scores.
                  </p>
                </div>
                <button
                  onClick={handleAddRow}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-lg transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Participant Row</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[550px]">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="bg-slate-900 sticky top-0 z-10 border-b border-white/10 shadow-md">
                    <tr className="text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-3 w-10 text-center border-r border-white/5">#</th>
                      <th className="py-3 px-3 min-w-[160px] border-r border-white/5">Participant Name</th>
                      <th className="py-3 px-3 min-w-[120px] border-r border-white/5">USN</th>
                      <th className="py-3 px-3 min-w-[150px] border-r border-white/5">Department</th>
                      <th className="py-3 px-2 w-24 text-center border-r border-white/5">Accuracy (%)</th>
                      <th className="py-3 px-2 w-20 text-center border-r border-white/5">Speed (ms)</th>
                      <th className="py-3 px-2 w-20 text-center border-r border-white/5">Clean (/25)</th>
                      <th className="py-3 px-2 w-20 text-center border-r border-white/5">Time (/25)</th>
                      <th className="py-3 px-2 w-20 text-center border-r border-white/5">Mem (/25)</th>
                      <th className="py-3 px-2 w-20 text-center border-r border-white/5">Bonus</th>
                      <th className="py-3 px-3 min-w-[100px] text-center border-r border-white/5 bg-purple-950/30 text-purple-200 font-bold">
                        Total Score
                      </th>
                      <th className="py-3 px-3 min-w-[160px] border-r border-white/5">Verdict</th>
                      <th className="py-3 px-3 min-w-[140px] border-r border-white/5">Architects Status</th>
                      {customColumns.map((col) => (
                        <th key={col} className="py-3 px-3 min-w-[120px] border-r border-white/5 text-cyan-300">
                          {col}
                        </th>
                      ))}
                      <th className="py-3 px-2 w-10 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRows.map((row, idx) => {
                      const isTop = row.test_accuracy >= 80;
                      const isFail = row.test_accuracy < 50;

                      return (
                        <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-2.5 px-3 text-center border-r border-white/5 text-slate-500 font-bold">
                            {idx + 1}
                          </td>
                          
                          {/* Student Name */}
                          <td className="py-2.5 px-3 border-r border-white/5">
                            <input
                              type="text"
                              placeholder="Enter participant name..."
                              value={row.student_name}
                              onChange={(e) => handleCellChange(row.id, 'student_name', e.target.value)}
                              className="w-full bg-transparent border-none text-white font-bold focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* USN */}
                          <td className="py-2.5 px-3 border-r border-white/5">
                            <input
                              type="text"
                              placeholder="1RV23..."
                              value={row.usn}
                              onChange={(e) => handleCellChange(row.id, 'usn', e.target.value)}
                              className="w-full bg-transparent border-none text-purple-300 focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Department */}
                          <td className="py-2.5 px-3 border-r border-white/5">
                            <input
                              type="text"
                              placeholder="Department..."
                              value={row.department}
                              onChange={(e) => handleCellChange(row.id, 'department', e.target.value)}
                              className="w-full bg-transparent border-none text-slate-300 text-[11px] focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Accuracy */}
                          <td className="py-2.5 px-2 text-center border-r border-white/5">
                            <input
                              type="number"
                              value={row.test_accuracy}
                              onChange={(e) => handleCellChange(row.id, 'test_accuracy', Number(e.target.value))}
                              className={`w-full text-center bg-transparent border-none font-extrabold focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded ${
                                isTop ? 'text-emerald-400' : isFail ? 'text-rose-400' : 'text-amber-400'
                              }`}
                            />
                          </td>

                          {/* Speed ms */}
                          <td className="py-2.5 px-2 text-center border-r border-white/5">
                            <input
                              type="number"
                              step="0.1"
                              value={row.execution_time_ms}
                              onChange={(e) => handleCellChange(row.id, 'execution_time_ms', Number(e.target.value))}
                              className="w-full text-center bg-transparent border-none text-cyan-300 font-bold focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Code Cleanliness */}
                          <td className="py-2.5 px-2 text-center border-r border-white/5">
                            <input
                              type="number"
                              max="25"
                              value={row.code_cleanliness}
                              onChange={(e) => handleCellChange(row.id, 'code_cleanliness', Number(e.target.value))}
                              className="w-full text-center bg-transparent border-none text-slate-200 focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Time Complexity */}
                          <td className="py-2.5 px-2 text-center border-r border-white/5">
                            <input
                              type="number"
                              max="25"
                              value={row.time_complexity_score}
                              onChange={(e) => handleCellChange(row.id, 'time_complexity_score', Number(e.target.value))}
                              className="w-full text-center bg-transparent border-none text-slate-200 focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Memory */}
                          <td className="py-2.5 px-2 text-center border-r border-white/5">
                            <input
                              type="number"
                              max="25"
                              value={row.memory_score}
                              onChange={(e) => handleCellChange(row.id, 'memory_score', Number(e.target.value))}
                              className="w-full text-center bg-transparent border-none text-slate-200 focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Bonus */}
                          <td className="py-2.5 px-2 text-center border-r border-white/5">
                            <input
                              type="number"
                              value={row.bonus_points}
                              onChange={(e) => handleCellChange(row.id, 'bonus_points', Number(e.target.value))}
                              className="w-full text-center bg-transparent border-none text-amber-300 font-bold focus:outline-none focus:bg-purple-950/30 px-1 py-0.5 rounded"
                            />
                          </td>

                          {/* Total Score */}
                          <td className="py-2.5 px-3 text-center border-r border-white/5 bg-purple-950/20 font-extrabold text-amber-400">
                            {row.total_score} Pts
                          </td>

                          {/* Verdict Dropdown */}
                          <td className="py-2.5 px-3 border-r border-white/5">
                            <select
                              value={row.verdict}
                              onChange={(e) => handleCellChange(row.id, 'verdict', e.target.value)}
                              className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                            >
                              <option value="QUALIFIED_TOP_PERFORMER">🏆 Qualified Top Performer</option>
                              <option value="AVERAGE_PASS">✓ Average Pass</option>
                              <option value="NEEDS_ATTENTION_FAIL">⚠️ Needs Attention / Fail</option>
                            </select>
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 border-r border-white/5">
                            <span
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold block text-center ${
                                row.submitted_to_architects
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              }`}
                            >
                              {row.submitted_to_architects ? '✓ Transmitted' : 'Pending Submit'}
                            </span>
                          </td>

                          {/* Custom Columns */}
                          {customColumns.map((col) => (
                            <td key={col} className="py-2.5 px-3 border-r border-white/5">
                              <input
                                type="text"
                                placeholder="Fill note..."
                                defaultValue=""
                                className="w-full bg-transparent border-none text-cyan-200 focus:outline-none focus:bg-cyan-950/30 px-1 py-0.5 rounded"
                              />
                            </td>
                          ))}

                          {/* Delete Action */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => handleDeleteRow(row.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOP PERFORMERS LEADERBOARD TAB                                         */}
      {/* ========================================================================= */}
      {activeTab === 'top_performers' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Coding Challenge · Top Performers Leaderboard</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Participants scoring &gt;80% test accuracy with benchmark sub-millisecond execution speeds.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              🏆 Top Tier ({topPerformers.length})
            </span>
          </div>

          {topPerformers.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-xs text-slate-400 font-mono">
                No top performers evaluated yet. Score participants in the Excel Spreadsheet tab to populate the leaderboard.
              </p>
              <button
                onClick={() => setActiveTab('spreadsheet')}
                className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
              >
                Go to Excel Spreadsheet →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPerformers.slice(0, 3).map((p: any, idx: number) => (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden shadow-xl ${
                      idx === 0
                        ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/50'
                        : idx === 1
                        ? 'bg-gradient-to-b from-slate-800/40 to-slate-900 border-slate-400/40'
                        : 'bg-gradient-to-b from-amber-900/30 to-slate-900 border-amber-700/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold font-mono text-xs ${
                        idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        {p.test_accuracy}% Accuracy
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white font-heading">{p.student_name || 'Participant'}</h4>
                      <p className="text-xs text-purple-300 font-mono">{p.usn} • {p.department}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Execution Speed:</span>
                        <span className="text-cyan-300 font-bold">{p.execution_time_ms}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Score:</span>
                        <span className="text-amber-400 font-extrabold">{p.total_score} Pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-3">Rank</th>
                      <th className="py-3 px-3">Participant</th>
                      <th className="py-3 px-3">Accuracy</th>
                      <th className="py-3 px-3">Speed</th>
                      <th className="py-3 px-3">Cleanliness</th>
                      <th className="py-3 px-3">Verdict</th>
                      <th className="py-3 px-3 text-right">Sprint Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topPerformers.map((p: any, idx: number) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-3 font-bold text-amber-400">#{idx + 1}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-white block">{p.student_name || 'Participant'}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{p.usn} • {p.department}</span>
                        </td>
                        <td className="py-3.5 px-3 font-extrabold text-emerald-400">{p.test_accuracy}%</td>
                        <td className="py-3.5 px-3 font-bold text-cyan-300">{p.execution_time_ms}ms</td>
                        <td className="py-3.5 px-3 text-slate-300">{p.code_cleanliness}/25</td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            🏆 Top Performer
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-extrabold text-amber-300">
                          +{p.total_score} Pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. NEEDS ATTENTION & WEAK DIAGNOSTICS TAB                                 */}
      {/* ========================================================================= */}
      {activeTab === 'weak_performers' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-slate-950/60 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Deficiency Diagnostic & Remediation Station</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Participants scoring &lt;80% test accuracy with timeouts, deadlocks, or syntax faults.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold">
              ⚠️ Needs Intervention ({weakPerformers.length})
            </span>
          </div>

          {weakPerformers.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-xs text-slate-400 font-mono">
                No weak or deficient performers found. All evaluated participants scored &gt;80% test accuracy.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {weakPerformers.map((p: any) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">{p.student_name || 'Participant'}</h4>
                      <p className="text-xs text-rose-300 font-mono">{p.usn} • {p.department}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                        {p.test_accuracy}% Accuracy
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono font-bold">
                        ⏱️ {p.execution_time_ms}ms
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/20 text-xs font-mono text-amber-200 space-y-1">
                    <span className="text-amber-400 font-bold uppercase text-[10px] flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Actionable Diagnostic Remediation:</span>
                    </span>
                    <p className="text-slate-300 font-sans">{p.diagnostic_tip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
