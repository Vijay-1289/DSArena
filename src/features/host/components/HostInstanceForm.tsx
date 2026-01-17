import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, BrainCircuit, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormData } from '../hooks/useHostDashboardLogic';

interface HostInstanceFormProps {
    dashboardMode: 'exam' | 'practice';
    setDashboardMode: (mode: 'exam' | 'practice') => void;
    formData: FormData;
    setFormData: (data: FormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    editingInstanceId: string | null;
    setEditingInstanceId: (id: string | null) => void;
}

export const HostInstanceForm = ({
    dashboardMode,
    setDashboardMode,
    formData,
    setFormData,
    onSubmit,
    editingInstanceId,
    setEditingInstanceId
}: HostInstanceFormProps) => {
    return (
        <div className="space-y-6">
            <Tabs value={dashboardMode} onValueChange={(v) => setDashboardMode(v as 'exam' | 'practice')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 h-12 p-1.5 overflow-hidden">
                    <TabsTrigger
                        value="exam"
                        className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none uppercase h-full font-bold text-[10px] tracking-widest gap-2 transition-all duration-300"
                    >
                        <Settings className="h-3.5 w-3.5" /> Create Exam Room
                    </TabsTrigger>
                    <TabsTrigger
                        value="practice"
                        className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400 data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none h-full uppercase font-bold text-[10px] tracking-widest gap-2 transition-all duration-300"
                    >
                        <BrainCircuit className="h-3.5 w-3.5" /> Create Classroom
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card className={cn(
                "glass transition-all duration-500",
                dashboardMode === 'exam' ? "border-cyan-500/20 bg-cyan-500/5" : "border-violet-500/20 bg-violet-500/5"
            )}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white font-space">
                        {dashboardMode === 'exam' ? (
                            <><Settings className="h-5 w-5 text-cyan-400" /> New Exam Room</>
                        ) : (
                            <><BrainCircuit className="h-5 w-5 text-violet-400" /> New Practice Classroom</>
                        )}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {dashboardMode === 'exam' ? "Configure the parameters for your next secure examination." : "Initialize a new practice set for students."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs uppercase tracking-wider">Topic</Label>
                                <Input
                                    placeholder={dashboardMode === 'exam' ? "e.g. Adv. Data Structures" : "e.g. Array Algorithms"}
                                    className="bg-black/40 border-slate-800"
                                    value={formData.topic}
                                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs uppercase tracking-wider">Date</Label>
                                <Input type="date" className="bg-black/40 border-slate-800" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                        </div>

                        {dashboardMode === 'exam' && (
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Start Time</Label>
                                    <Input type="time" className="bg-black/40 border-slate-800" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Duration (min)</Label>
                                    <Input type="number" className="bg-black/40 border-slate-800" value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Max Students</Label>
                                    <Input type="number" className="bg-black/40 border-slate-800" value={formData.maxStudents} onChange={e => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })} required />
                                </div>
                            </div>
                        )}

                        <div className={cn("grid gap-4 pt-4 border-t border-white/5", dashboardMode === 'exam' ? "md:grid-cols-2" : "md:grid-cols-1")}>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs uppercase tracking-wider">Number of Questions</Label>
                                <Select value={formData.numQuestions.toString()} onValueChange={v => setFormData({ ...formData, numQuestions: parseInt(v) })}>
                                    <SelectTrigger className="bg-black/40 border-slate-800"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800">
                                        {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n} Question{n > 1 ? 's' : ''}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* {dashboardMode === 'exam' && (
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Points Per Question</Label>
                                    <Input type="number" className="bg-black/40 border-slate-800" value={formData.scorePerQuestion} onChange={e => setFormData({ ...formData, scorePerQuestion: parseInt(e.target.value) })} />
                                </div>
                            )} */}
                        </div>

                        <div className={cn("flex items-center justify-between p-4 rounded-xl border transition-colors", dashboardMode === 'exam' ? "bg-cyan-500/5 border-cyan-500/20" : "bg-violet-500/5 border-violet-500/20")}>
                            <div className="flex items-center gap-3">
                                {dashboardMode === 'exam' ? (
                                    <><Zap className="h-5 w-5 text-cyan-400" /><div><p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Efficiency Meta</p><p className="text-[10px] text-slate-500 font-mono">Allocation: {(formData.duration / formData.numQuestions).toFixed(1)} mins / question</p></div></>
                                ) : (
                                    <><BrainCircuit className="h-5 w-5 text-violet-400" /><div><p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Practice Protocol</p><p className="text-[10px] text-slate-500 font-mono">Iterative neuro-synchronization enabled.</p></div></>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {editingInstanceId && <Button type="button" variant="ghost" onClick={() => setEditingInstanceId(null)} className="text-slate-500 hover:text-white">Cancel</Button>}
                                <Button type="submit" className={cn("sheen-btn text-white font-bold tracking-widest uppercase text-[10px] h-11 px-8 transition-all active:scale-95 shadow-lg", dashboardMode === 'exam' ? "bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-900/40" : "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-900/40")}>
                                    {editingInstanceId ? 'Update Protocol' : 'Initialize Instance'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
