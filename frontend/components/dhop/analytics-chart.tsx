'use client';

import React, { useState, useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
}

export function AnalyticsChart({
  title,
  data = [],
  type = 'line',
  color = 'var(--primary)',
  height = 180,
}: AnalyticsChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG parameters
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = 500; // base viewport width for scalable SVG viewBox
  const viewBoxWidth = chartWidth + padding.left + padding.right;
  const viewBoxHeight = height;

  // Find max value to scale Y axis
  const maxValue = useMemo(() => {
    const vals = data.map((d) => d.value);
    const maxVal = vals.length > 0 ? Math.max(...vals) : 0;
    return maxVal > 0 ? maxVal * 1.15 : 10; // add 15% top padding
  }, [data]);

  // Map data coordinates
  const points = useMemo(() => {
    if (data.length === 0) return [];
    const stepX = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
    return data.map((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
      return { x, y, label: d.label, value: d.value };
    });
  }, [data, maxValue, chartWidth, chartHeight, padding.left, padding.top]);

  // Construct SVG path for line chart
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  // Construct area path under the line
  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const basePath = `L ${last.x} ${padding.top + chartHeight} L ${first.x} ${padding.top + chartHeight} Z`;
    return `${pathD} ${basePath}`;
  }, [points, pathD, padding.top, chartHeight]);

  return (
    <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        {hoveredIdx !== null && data[hoveredIdx] && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground animate-in fade-in zoom-in-95 duration-150">
            {data[hoveredIdx].label}: <strong className="text-foreground">{data[hoveredIdx].value}</strong>
          </span>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-xs text-muted-foreground italic">
            No statistics available for this period.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + chartHeight * ratio;
              const val = Math.round(maxValue * (1 - ratio));
              return (
                <g key={i} className="opacity-40">
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-medium fill-muted-foreground font-sans"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Vertical Tick Labels */}
            {points.map((p, i) => {
              // Only render label ticks for spaced intervals if there are too many items
              const shouldShowLabel = points.length <= 10 || i % Math.ceil(points.length / 8) === 0;
              if (!shouldShowLabel) return null;
              return (
                <text
                  key={i}
                  x={p.x}
                  y={padding.top + chartHeight + 16}
                  textAnchor="middle"
                  className="text-[9px] font-medium fill-muted-foreground font-sans"
                >
                  {p.label}
                </text>
              );
            })}

            {type === 'line' ? (
              <>
                {/* Area under the line */}
                <path d={areaD} fill="url(#chartAreaGradient)" className="transition-all duration-300" />
                {/* Path line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
                {/* Points on hover */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIdx === i ? 5.5 : 3}
                    fill={hoveredIdx === i ? 'var(--primary-hover)' : 'var(--card)'}
                    stroke={color}
                    strokeWidth={hoveredIdx === i ? 2.5 : 1.5}
                    className="transition-all duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                ))}
              </>
            ) : (
              <>
                {/* Bar chart rendering */}
                {points.map((p, i) => {
                  const barWidth = Math.max(12, (chartWidth / points.length) * 0.6);
                  const barHeight = padding.top + chartHeight - p.y;
                  return (
                    <rect
                      key={i}
                      x={p.x - barWidth / 2}
                      y={p.y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      fill={hoveredIdx === i ? 'var(--primary-hover)' : color}
                      className="transition-all duration-150 cursor-pointer opacity-90 hover:opacity-100"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  );
                })}
              </>
            )}

            {/* Invisible hover trigger columns for easier touch/hover interaction */}
            {points.map((p, i) => {
              const stepX = chartWidth / points.length;
              return (
                <rect
                  key={`trigger-${i}`}
                  x={p.x - stepX / 2}
                  y={padding.top}
                  width={stepX}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
