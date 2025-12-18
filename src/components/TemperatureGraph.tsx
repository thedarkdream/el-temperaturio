import Chart from "react-apexcharts";
import { LineChartProps } from "../dto/LineChartProps";
import Spinner from '../puff.svg';
import { useState, useEffect, useRef } from 'react';

function TemperatureGraph( props: LineChartProps ) {
    const [chartHeight, setChartHeight] = useState<number>(400);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateHeight = () => {
            if (containerRef.current) {
                // Get the container's position from the top of the viewport
                const rect = containerRef.current.getBoundingClientRect();
                const topOffset = rect.top;
                
                // Detect if mobile device
                const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                const isPortrait = window.innerHeight > window.innerWidth;
                
                // Calculate available height with appropriate padding
                const bottomPadding = isMobile ? 20 : 60;
                const availableHeight = window.innerHeight - topOffset - bottomPadding;
                
                // Set minimum and maximum heights based on device and orientation
                let minHeight: number;
                let maxHeight: number;
                if (isMobile) {
                    minHeight = isPortrait ? 300 : 250;
                    maxHeight = availableHeight; // No max on mobile, use available space
                } else {
                    minHeight = isPortrait ? 300 : 350;
                    maxHeight = 550; // Max height on desktop
                }
                
                // Use available height, capped by minimum and maximum
                const calculatedHeight = Math.max(minHeight, Math.min(availableHeight, maxHeight));
                
                setChartHeight(calculatedHeight);
            }
        };

        // Calculate on mount and when data changes
        calculateHeight();
        
        // Recalculate on window resize
        window.addEventListener('resize', calculateHeight);
        
        // Also recalculate after a short delay to ensure DOM is fully rendered
        const timeoutId = setTimeout(calculateHeight, 100);
        
        return () => {
            window.removeEventListener('resize', calculateHeight);
            clearTimeout(timeoutId);
        };
    }, [props.data]);

    return <div className="temperatureGraph" ref={containerRef}>
        {props.loading && <img src={Spinner} alt="Loading..." width="100px"/>}
        {props.data && (
            <div className="chartContainer" style={{ height: `${chartHeight}px` }}>
                <Chart 
                    options={props.data.options} 
                    series={props.data.series}
                    type="area"
                    height={chartHeight - 48}
                    width="100%"
                />
            </div>
        )}
    </div>
}

export default TemperatureGraph;