import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#030712]/80 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-xl font-sans group-[.toaster]:px-6 group-[.toaster]:py-4",
          description: "group-[.toast]:text-white/40 group-[.toast]:font-mono group-[.toast]:text-[10px] group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:text-[10px] group-[.toast]:tracking-widest group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-white/60",
          success: "group-[.toast]:border-emerald-500/30 group-[.toast]:bg-emerald-500/[0.02]",
          error: "group-[.toast]:border-red-500/30 group-[.toast]:bg-red-500/[0.02]",
          warning: "group-[.toast]:border-amber-500/30 group-[.toast]:bg-amber-500/[0.02]",
          info: "group-[.toast]:border-blue-500/30 group-[.toast]:bg-blue-500/[0.02]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
