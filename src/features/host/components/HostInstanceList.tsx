import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamInstance } from '../hooks/useHostDashboardLogic';

interface HostInstanceListProps {
    instances: ExamInstance[];
    selectedInstanceId: string | null;
    setSelectedInstanceId: (id: string | null) => void;
    dashboardMode: 'exam' | 'practice';
    onEdit: (instance: ExamInstance) => void;
    onDelete: (id: string) => void;
}

export const HostInstanceList = ({
    instances,
    selectedInstanceId,
    setSelectedInstanceId,
    dashboardMode,
    onEdit,
    onDelete
}: HostInstanceListProps) => {
    const filtered = instances.filter(i => dashboardMode === 'practice' ? i.topic.startsWith('[PRACTICE]') : !i.topic.startsWith('[PRACTICE]'));

    return (
        <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500/80 mb-4 px-2 italic">
                {dashboardMode === 'exam' ? 'Scheduled Exams' : 'Practice Registries'}
            </h2>
            {filtered.length === 0 ? (
                <div className="text-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-xs font-mono">EMPTY_REGISTRY</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((inst: ExamInstance) => (
                        <Card
                            key={inst.id}
                            onClick={() => setSelectedInstanceId(inst.id)}
                            className={cn(
                                "glass bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer",
                                selectedInstanceId === inst.id
                                    ? dashboardMode === 'exam' ? "border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                    : "border-white/5"
                            )}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", dashboardMode === 'exam' ? "text-cyan-400" : "text-violet-400")}>
                                            {inst.topic.replace('[PRACTICE] ', '')}
                                        </p>
                                        <h4 className="text-lg font-space font-bold text-white group-hover:text-primary transition-colors truncate">
                                            {new Date(inst.start_time).toLocaleDateString()}
                                        </h4>
                                    </div>
                                    <Badge className={cn("border-0 shrink-0", inst.status === 'active' ? 'bg-green-500/20 text-green-400' : inst.status === 'scheduled' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-500/20 text-slate-400')}>
                                        {inst.status}
                                    </Badge>
                                </div>
                                {dashboardMode === 'exam' && (
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500"><Clock className="h-3 w-3" /> {new Date(inst.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500"><Users className="h-3 w-3" /> Max {inst.max_students}</div>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-white/5 flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(inst); }} className={cn("w-full text-[10px] uppercase font-bold tracking-widest", dashboardMode === 'exam' ? "hover:bg-cyan-500/10 hover:text-cyan-400" : "hover:bg-violet-500/10 hover:text-violet-400")}>Edit</Button>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(inst.id); }} className="text-red-500/40 hover:text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
