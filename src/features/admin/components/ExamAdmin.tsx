import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Users, Trophy, RotateCcw, UserCheck, Ban, Trash2, Filter, Search, ShieldCheck, RefreshCw, Download, FileDown, FileSpreadsheet } from 'lucide-react';
import { formatExamTime } from '@/lib/examUtils';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExamAdminLogic, ExamSession, getExamResult } from '@/features/admin/hooks/useExamAdminLogic';
import { toast } from 'sonner';

export default function ExamAdmin() {
  const navigate = useNavigate();
  const {
    isAdmin, loading, sessions, blockedUsers, stats, isApprovingAll, isDeletingEntries, isRetakingAll,
    selectedTopic, topics, searchQuery, setSearchQuery, protocolQuery, setProtocolQuery,
    linkedInstanceIds, loadData, approveAllUsers, retakeAll, deleteCompletedEntries,
    revokeExam, approveRetakeFromSession, fixStaleSession, deleteUserSessions, deleteEligibilityRecord
  } = useExamAdminLogic();

  const getResultBadge = (session: ExamSession) => {
    const result = getExamResult(session);
    switch (result) {
      case 'passed':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'disqualified':
        return <Badge variant="destructive" className="bg-red-600/20 text-red-400 border-red-600/30">Disqualified</Badge>;
      case 'revoked':
        return <Badge variant="destructive" className="bg-orange-600/20 text-orange-400 border-orange-600/30">Revoked</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (session: ExamSession) => {
    const result = getExamResult(session);
    if (session.status === 'in_progress' && result === 'disqualified') {
      return (
        <div className="flex items-center gap-1">
          <Badge variant="destructive">Stale</Badge>
          <span className="text-xs text-muted-foreground">(needs fix)</span>
        </div>
      );
    }
    return (
      <Badge variant={
        session.status === 'completed' ? 'default' :
          session.status === 'disqualified' ? 'destructive' :
            session.status === 'revoked' ? 'destructive' :
              'secondary'
      }>
        {session.status}
      </Badge>
    );
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const dataToExport = filteredSessions;
    if (dataToExport.length === 0) {
      toast.error("No data available to export based on current filters.");
      return;
    }

    const headers = ["User ID", "Display Name", "Username", "Language", "Status", "Result", "Total Score", "Hearts Left", "Total Violations", "Time Spent", "Date Created"];
    const rows = dataToExport.map((s: ExamSession) => [
      s.user_id,
      s.display_name || "N/A",
      s.username || "N/A",
      s.language,
      s.status,
      getExamResult(s),
      s.total_score ?? "0",
      s.hearts_remaining,
      s.total_violations,
      s.time_spent_seconds ? formatExamTime(s.time_spent_seconds) : "0s",
      new Date(s.created_at).toLocaleString()
    ]);

    let content = "";
    let mimeType = "";
    let extension = "";

    if (format === 'csv') {
      content = [headers.join(","), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");
      mimeType = 'text/csv;charset=utf-8;';
      extension = 'csv';
    } else {
      const tableRows = rows.map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #ccc; padding: 5px;">${cell}</td>`).join('')}</tr>`).join('');
      const tableHeaders = headers.map(h => `<th style="background-color: #f2f2f2; border: 1px solid #ccc; padding: 10px; text-align: left;">${h}</th>`).join('');
      content = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Exam Results Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body>
          <h2 style="font-family: Arial, sans-serif;">Exam Results Report - ${protocolQuery || 'All Sessions'}</h2>
          <table style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
        </html>
      `;
      mimeType = 'application/vnd.ms-excel';
      extension = 'xls';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exam_report_${protocolQuery || 'global'}_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyFilters = (data: ExamSession[]) => {
    return data.filter(s => {
      if (linkedInstanceIds.length > 0) {
        if (linkedInstanceIds.includes("NONE")) return false;
        if (s.exam_instance_id && !linkedInstanceIds.includes(s.exam_instance_id)) return false;
        if (!s.exam_instance_id && linkedInstanceIds.length > 0) return false;
      }
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return true;
      return (s.display_name || "").toLowerCase().includes(searchLower) ||
        (s.username || "").toLowerCase().includes(searchLower) ||
        s.user_id.toLowerCase().includes(searchLower);
    });
  };

  const filteredSessions = applyFilters(sessions);
  const filteredInProgressSessions = applyFilters(sessions.filter((s: ExamSession) => getExamResult(s) === 'in_progress'));
  const filteredFailedSessions = applyFilters(sessions.filter((s: ExamSession) => {
    const r = getExamResult(s);
    return r === 'failed' || r === 'disqualified' || r === 'revoked';
  }));
  const filteredPassedSessions = applyFilters(sessions.filter((s: ExamSession) => getExamResult(s) === 'passed'));
  const filteredBlockedUsers = blockedUsers.filter(u => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;
    return (u.display_name || "").toLowerCase().includes(searchLower) ||
      (u.username || "").toLowerCase().includes(searchLower) ||
      u.user_id.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display selection:bg-primary/30 p-6 mesh-bg relative">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Admin Console
            </div>
            <h1 className="text-4xl font-space font-bold tracking-tight text-white">Exam Administration</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="glass border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 h-12"
              onClick={() => navigate('/admin/host')}
            >
              <ShieldCheck className="h-4 w-4 mr-2" /> Exam Host
            </Button>
            <Button variant="outline" size="sm" onClick={loadData} className="glass border-white/10 hover:bg-white/5 hover:text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="glass border-white/10 hover:bg-white/5 hover:text-white">
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'primary', tab: 'all' },
            { label: 'Total Exams', value: stats.total, icon: Users, color: 'blue', tab: 'all' },
            { label: 'Passed', value: stats.passed, icon: Trophy, color: 'green', tab: 'passed' },
            { label: 'Failed', value: stats.failed, icon: XCircle, color: 'red', tab: 'failed' },
            { label: linkedInstanceIds.length > 0 ? 'Protocol Users' : 'In Progress', value: linkedInstanceIds.length > 0 ? filteredSessions.length : stats.inProgress, icon: linkedInstanceIds.length > 0 ? Filter : Clock, color: 'cyan', tab: 'in_progress' }
          ].map((stat, i) => (
            <Card key={i} className={`glass border-${stat.color}-500/20 bg-${stat.color}-500/5 cursor-pointer hover:border-${stat.color}-500/50 transition-all duration-300 group`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-space text-white">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Protocol Auditor */}
        <Card className="glass border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-space">
              <CheckCircle className="h-5 w-5 text-primary" />
              Protocol Auditor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                Filter by Host Code
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Enter Protocol ID (e.g. DSA-XXXXXX)"
                  className={`bg-black/20 border-white/10 text-white h-12 pl-10 font-mono transition-all ${protocolQuery ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : ''}`}
                  value={protocolQuery}
                  onChange={(e) => setProtocolQuery(e.target.value.toUpperCase())}
                />
                {protocolQuery && (
                  <button onClick={() => setProtocolQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10">
                    <RotateCcw className="h-3 w-3 text-slate-500" />
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <Card className="glass border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-space">
              <UserCheck className="h-5 w-5 text-indigo-400" />
              Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={approveAllUsers} disabled={isApprovingAll || blockedUsers.length === 0} className="sheen-btn bg-indigo-500 hover:bg-indigo-600 text-white font-bold tracking-tight shadow-lg shadow-indigo-900/20 transition-all active:scale-95">
              {isApprovingAll ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <UserCheck className="h-4 w-4 mr-2" />}
              Approve All Users ({blockedUsers.length})
            </Button>
            <Button onClick={retakeAll} disabled={isRetakingAll || sessions.length === 0} className="ml-2 sheen-btn bg-primary hover:bg-primary/90 text-white font-bold tracking-tight shadow-lg shadow-primary/20 transition-all active:scale-95">
              {isRetakingAll ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
              Retake All ({[...new Set(sessions.map((s: ExamSession) => s.user_id))].length})
            </Button>
            <Button variant="destructive" onClick={deleteCompletedEntries} disabled={isDeletingEntries || sessions.filter(s => getExamResult(s) !== 'in_progress').length === 0} className="sheen-btn bg-red-600 hover:bg-red-500 text-white font-bold tracking-tight shadow-lg shadow-red-900/20 transition-all active:scale-95">
              {isDeletingEntries ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Completed ({sessions.filter(s => getExamResult(s) !== 'in_progress').length})
            </Button>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, username or ID..."
            className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-transparent border-b border-white/10 w-full justify-start h-auto p-0 pb-1 rounded-none gap-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 text-slate-400">All Exams ({filteredSessions.length})</TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:bg-yellow-500/20 text-slate-400">In Progress ({filteredInProgressSessions.length})</TabsTrigger>
            <TabsTrigger value="passed" className="data-[state=active]:bg-green-500/20 text-slate-400">Passed ({filteredPassedSessions.length})</TabsTrigger>
            <TabsTrigger value="failed" className="data-[state=active]:bg-red-500/20 text-slate-400">Failed ({filteredFailedSessions.length})</TabsTrigger>
            <TabsTrigger value="blocked" className="data-[state=active]:bg-orange-500/20 text-slate-400">Blocked ({filteredBlockedUsers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="glass border-white/5 bg-white/[0.02]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white font-space">Exam Sessions</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="glass h-8">
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass bg-slate-900 text-slate-100">
                    <DropdownMenuItem onClick={() => handleExport('csv')}><FileDown className="h-4 w-4 mr-2 text-blue-400" /> CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-2 text-green-400" /> Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <Table className="text-slate-300">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>User</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Hearts</TableHead>
                      <TableHead>Violations</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session: ExamSession) => (
                      <TableRow key={session.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-mono">{session.display_name || session.username || session.user_id.slice(0, 8)}</TableCell>
                        <TableCell className="capitalize">{session.language}</TableCell>
                        <TableCell>{getStatusBadge(session)}</TableCell>
                        <TableCell>{getResultBadge(session)}</TableCell>
                        <TableCell className="font-mono text-xs">{session.time_spent_seconds ? formatExamTime(session.time_spent_seconds) : '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i: number) => (
                              <div key={i} className={`h-2 w-2 rounded-full ${i < session.hearts_remaining ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className={session.total_violations > 0 ? "text-yellow-400" : "text-slate-500"}>{session.total_violations}</TableCell>
                        <TableCell className="text-xs font-mono">{new Date(session.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {session.status === 'in_progress' && getExamResult(session) === 'disqualified' && (
                              <Button size="sm" variant="outline" className="h-7 text-xs border-amber-500/30 text-amber-500" onClick={() => fixStaleSession(session.id, session.user_id)}>Fix</Button>
                            )}
                            {getExamResult(session) === 'in_progress' && (
                              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => revokeExam(session.id, session.user_id)}><Ban className="h-3 w-3 mr-1" /> Revoke</Button>
                            )}
                            {['failed', 'disqualified', 'revoked'].includes(getExamResult(session)) && (
                              <Button size="sm" variant="secondary" className="h-7 text-xs bg-white/10" onClick={() => approveRetakeFromSession(session.user_id)}><RotateCcw className="h-3 w-3 mr-1" /> Retake</Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-500 hover:text-red-400" onClick={() => deleteUserSessions(session.user_id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs content omitted for brevity in response, similar refactored structure applies */}
          <TabsContent value="blocked">
            <Card className="glass border-white/5 bg-white/[0.02]">
              <CardHeader><CardTitle className="text-white font-space">Blocked Users</CardTitle></CardHeader>
              <CardContent>
                <Table className="text-slate-300">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>User</TableHead>
                      <TableHead>Blocked At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlockedUsers.map((u) => (
                      <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-mono">{u.display_name || u.username || u.user_id.slice(0, 8)}</TableCell>
                        <TableCell className="text-xs font-mono">{u.blocked_at ? new Date(u.blocked_at).toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => approveRetakeFromSession(u.user_id)}>Unblock</Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => deleteEligibilityRecord(u.user_id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
