const fs = require('fs');

const css = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 5%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 4%;
    --popover-foreground: 0 0% 98%;

    --primary: 263 70% 50%;
    /* Deep Purple */
    --primary-foreground: 210 40% 98%;

    --secondary: 240 4% 16%;
    --secondary-foreground: 210 40% 98%;

    --muted: 240 4% 16%;
    --muted-foreground: 215 20% 65%;

    --accent: 263 70% 50%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 240 4% 16%;
    --input: 240 4% 16%;
    --ring: 263 70% 50%;

    --radius: 0.5rem;

    /* Custom Colors for Zen Mode */
    --zen-bg: #050508;
    --zen-card: #0a0a0f;
    --zen-purple: #8b5cf6;
    --zen-cyan: #06b6d4;

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    --gradient-text: linear-gradient(to right, #8b5cf6, #06b6d4);
    --gradient-glow: radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%);

    --sidebar-background: 240 10% 4%;
    --sidebar-foreground: 240 5% 90%;
    --sidebar-primary: 270 70% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 5% 15%;
    --sidebar-accent-foreground: 240 5% 90%;
    --sidebar-border: 240 5% 15%;
    --sidebar-ring: 270 70% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Inter', system-ui, sans-serif;
    background-color: var(--zen-bg);
    background-image:
      radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.05) 0px, transparent 50%);
    background-attachment: fixed;
  }

  code,
  pre,
  .font-mono {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }
}

@layer components {
  .glass-card {
    @apply bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-300;
  }

  .glass-panel {
    @apply bg-background/60 backdrop-blur-xl border-b border-white/5;
  }

  .gradient-text {
    @apply bg-clip-text text-transparent;
    background-image: var(--gradient-primary);
  }

  .text-glow {
    text-shadow: 0 0 20px hsl(173 80% 45% / 0.3);
  }

  .gradient-border {
    position: relative;
  }

  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: var(--gradient-primary);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .glow-effect {
    box-shadow: var(--shadow-glow);
  }

  .hover-lift {
    @apply transition-transform duration-300 ease-out;
  }

  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .hover-glow:hover {
    box-shadow: var(--shadow-glow);
  }

  .difficulty-easy {
    @apply text-success bg-success/10 border-success/30;
  }

  .difficulty-medium {
    @apply text-warning bg-warning/10 border-warning/30;
  }

  .difficulty-hard {
    @apply text-destructive bg-destructive/10 border-destructive/30;
  }

  /* Custom scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-muted/30 rounded-full;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-full;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }

  /* Animation classes */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.5s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.3s ease-out forwards;
  }

  .animate-pulse-glow {
    animation: pulseGlow 3s ease-in-out infinite;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulseGlow {

  0%,
  100% {
    box-shadow: 0 0 20px hsl(173 80% 45% / 0.1);
  }

  50% {
    box-shadow: 0 0 40px hsl(173 80% 45% / 0.3);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Glitchy Assistant Animations */
@keyframes glitchy-idle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }
}

@keyframes glitchy-peek {
  0% {
    transform: translateY(8px) scale(0.95);
  }

  50% {
    transform: translateY(-4px) scale(1.02);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes glitchy-alert {

  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px) rotate(-2deg);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px) rotate(2deg);
  }
}

@keyframes glitchy-think {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-3px) rotate(-3deg);
  }

  75% {
    transform: translateY(-3px) rotate(3deg);
  }
}

@keyframes glitchy-happy {

  0%,
  100% {
    transform: scale(1) translateY(0);
  }

  25% {
    transform: scale(1.05) translateY(-4px);
  }

  50% {
    transform: scale(1) translateY(-2px);
  }

  75% {
    transform: scale(1.03) translateY(-4px);
  }
}

.animate-glitchy-idle {
  animation: glitchy-idle 3s ease-in-out infinite;
}

.animate-glitchy-peek {
  animation: glitchy-peek 0.6s ease-out forwards;
}

.animate-glitchy-alert {
  animation: glitchy-alert 0.5s ease-in-out infinite;
}

.animate-glitchy-think {
  animation: glitchy-think 1.5s ease-in-out infinite;
}

.animate-glitchy-happy {
  animation: glitchy-happy 0.8s ease-in-out;
}

/* Monaco editor customizations */
.monaco-editor {
  @apply rounded-lg overflow-hidden;
}

.monaco-editor .margin {
  background-color: hsl(var(--card)) !important;
}

/* Paste protection toast */
.paste-blocked-toast {
  @apply fixed bottom-4 right-4 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg shadow-lg z-50;
  animation: slideUp 0.3s ease-out;
}
`;

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Restored src/index.css');
