import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShieldCheck, LayoutDashboard, Loader2 } from 'lucide-react';
import { useHostDashboardLogic } from '@/features/host/hooks/useHostDashboardLogic';
import { HostInstanceForm } from '@/features/host/components/HostInstanceForm';
import { HostQuestionDesigner } from '@/features/host/components/HostQuestionDesigner';
import { HostInstanceList } from '@/features/host/components/HostInstanceList';

export default function HostDashboard() {
    const navigate = useNavigate();
    const {
        isAdmin, loading, adminCode, practiceCode, instances, dashboardMode, setDashboardMode,
        isProcessing, selectedInstanceId, setSelectedInstanceId, editingInstanceId, setEditingInstanceId,
        manualQuestions, setManualQuestions, currentQuestion, setCurrentQuestion, questionLibrary,
        formData, setFormData, handleCreateInstance, handleEdit, addProblemFromBank, handleSaveQuestions, deleteInstance
    } = useHostDashboardLogic();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-cyan-500 animate-spin" />
                <p className="text-cyan-500/60 font-mono text-sm tracking-widest animate-pulse">SYNCHRONIZING_HOST_PROTOCOL...</p>
            </div>
        );
    }

    if (!isAdmin) return (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
            <ShieldCheck className="h-12 w-12 text-red-500" />
            <p className="text-red-500 font-mono text-lg tracking-widest uppercase">Clearance Insufficient</p>
            <Button variant="outline" onClick={() => navigate('/')} className="border-white/10 text-white">Return to Surface</Button>
        </div>
    );

    const currentInstance = instances.find(i => i.id === selectedInstanceId);
    const instanceQuota = currentInstance?.total_questions || 0;

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-display p-6 mesh-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                            <ShieldCheck className="h-3 w-3" /> Host Console
                        </div>
                        <h1 className="text-4xl font-space font-bold tracking-tight text-white flex items-center gap-3">
                            Exam Hosting Dashboard
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="text-cyan-400 border-cyan-500/30 bg-cyan-500/5 uppercase font-mono tracking-tighter cursor-pointer hover:bg-cyan-500/10 h-7 px-3"
                                    onClick={() => { navigator.clipboard.writeText(adminCode); toast.success("Exam protocol copied!"); }}
                                >
                                    Exam ID: {adminCode}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="text-violet-400 border-violet-500/30 bg-violet-500/5 uppercase font-mono tracking-tighter cursor-pointer hover:bg-violet-500/10 h-7 px-3"
                                    onClick={() => { navigator.clipboard.writeText(practiceCode); toast.success("Practice protocol copied!"); }}
                                >
                                    Practice ID: {practiceCode}
                                </Badge>
                            </div>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="glass border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 h-12" onClick={() => navigate('/exam-admin')}>
                            <ShieldCheck className="h-4 w-4 mr-2" /> Exam Admin
                        </Button>
                        <Button variant="outline" className="glass border-white/10 hover:bg-white/5 h-12" onClick={() => navigate('/dashboard')}>
                            <LayoutDashboard className="h-4 w-4 mr-2" /> Exit to Dashboard
                        </Button>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <HostInstanceForm
                            dashboardMode={dashboardMode}
                            setDashboardMode={setDashboardMode}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleCreateInstance}
                            editingInstanceId={editingInstanceId}
                            setEditingInstanceId={setEditingInstanceId}
                        />

                        <HostQuestionDesigner
                            selectedInstanceId={selectedInstanceId}
                            instanceQuota={instanceQuota}
                            manualQuestions={manualQuestions}
                            setManualQuestions={setManualQuestions}
                            currentQuestion={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            questionLibrary={questionLibrary}
                            onSave={handleSaveQuestions}
                            isProcessing={isProcessing}
                            dashboardMode={dashboardMode}
                            addProblemFromBank={addProblemFromBank}
                        />
                    </div>

                    <div className="space-y-6">
                        <HostInstanceList
                            instances={instances}
                            selectedInstanceId={selectedInstanceId}
                            setSelectedInstanceId={setSelectedInstanceId}
                            dashboardMode={dashboardMode}
                            onEdit={handleEdit}
                            onDelete={deleteInstance}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
