import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidChartProps {
    chart: string;
    id: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, id }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
        });
    }, []);

    useEffect(() => {
        if (chart && chartRef.current) {
            chartRef.current.removeAttribute('data-processed');
            try {
                mermaid.contentLoaded();
            } catch (e) {
                console.error('Mermaid render error:', e);
            }
        }
    }, [chart]);

    return (
        <div className="mermaid flex justify-center py-4 overflow-auto" id={id} ref={chartRef}>
            {chart}
        </div>
    );
};

export default MermaidChart;
