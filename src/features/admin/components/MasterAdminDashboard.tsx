import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShieldCheck, Plus, Loader2, LayoutDashboard, Users, Mail, Calendar, CheckCircle2, XCircle, Copy, Search } from 'lucide-react';
import { useMasterAdminLogic } from '../hooks/useMasterAdminLogic';

export default function MasterAdminDashboard() {
    const navigate = useNavigate();
    const { loading, admins, isInviting, handleInviteAdmin, toggleAdminStatus } = useMasterAdminLogic();
    const [inviteEmail, setInviteEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAdmins = admins.filter(admin =>
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.admin_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info('Protocol Code secured to clipboard.');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono">
            <div className="flex flex-col items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-cyan-500 animate-pulse" />
                <div className="text-cyan-500 text-xs tracking-[0.3em] uppercase animate-pulse">Establishing Root Access...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-display p-6 mesh-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                            <ShieldCheck className="h-3 w-3" /> Master Control Protocol
                        </div>
                        <h1 className="text-4xl font-space font-bold tracking-tight text-white">Root Administration</h1>
                    </div>
                    <Button variant="outline" className="glass border-white/10 hover:bg-white/5 h-12" onClick={() => navigate('/dashboard')}>
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Center Console
                    </Button>
                </header>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="glass border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-space text-white flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-primary" /> Recruit Host
                                </CardTitle>
                                <CardDescription>Authorize a new Host Operator by email address.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="operator@dsarena.net"
                                        className="bg-black/40 border-slate-800"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                    <p className="text-[10px] text-slate-500 font-mono italic">A unique protocol signature will be generated.</p>
                                </div>
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase text-xs h-11"
                                    onClick={async () => {
                                        if (await handleInviteAdmin(inviteEmail)) setInviteEmail('');
                                    }}
                                    disabled={isInviting || !inviteEmail}
                                >
                                    {isInviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                    Authorize Host
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-4">
                            <Card className="glass border-white/5 bg-white/[0.02] p-4">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Users className="h-8 w-8 text-primary" />
                                    <div>
                                        <div className="text-2xl font-bold font-space text-white">{admins.length}</div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest">Global Operators</div>
                                    </div>
                                </div>
                            </Card>
                            <Card className="glass border-white/5 bg-white/[0.02] p-4">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    <div>
                                        <div className="text-2xl font-bold font-space text-white">{admins.filter(a => a.is_active).length}</div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest">Active Links</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search operators by email or protocol signature..."
                                className="pl-10 h-12 bg-black/20 border-white/10 text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {filteredAdmins.map((admin) => (
                                <Card key={admin.id} className="glass border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Mail className="h-3 w-3" /> Digital Identity
                                                    </p>
                                                    <h3 className="font-space font-bold text-white group-hover:text-primary transition-colors">{admin.email}</h3>
                                                </div>
                                                <Badge variant={admin.is_active ? "default" : "destructive"} className={admin.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}>
                                                    {admin.is_active ? "ACTIVE_LINK" : "SIGNAL_LOST"}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] text-slate-500 uppercase tracking-tighter">Protocol Signature</p>
                                                    <p className="font-mono text-xs text-primary font-bold">{admin.admin_code}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={() => copyToClipboard(admin.admin_code)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                                    <Calendar className="h-3 w-3" /> Authorized: {new Date(admin.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex gap-2">
                                                    {!admin.is_root && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={admin.is_active ? "text-red-500/60 hover:text-red-500 hover:bg-red-500/10" : "text-green-500/60 hover:text-green-500 hover:bg-green-500/10"}
                                                            onClick={() => toggleAdminStatus(admin.id, admin.is_active)}
                                                        >
                                                            {admin.is_active ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                                                            {admin.is_active ? 'Sever Link' : 'Re-establish'}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
