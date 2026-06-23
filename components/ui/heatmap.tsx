"use client";

import { Tooltip } from "@/components/ui/tooltip";
import { useEffect, useRef, type HTMLAttributes } from 'react';

export type HeatmapValue = { date: string; count: number };

type ColorMode = {
  colorMode: "gradient";
  numColors: number;
  minColor?: string;
  maxColor?: string;
} | {
  colorMode: "discrete";
  colors?: string[];
}

type HeatmapProps = HTMLAttributes<HTMLDivElement> & ColorMode & {
  values: HeatmapValue[];
  startDate: string;
  endDate: string;
  cellSize?: number;
};

const defaultColors = [ // using the default github greens
  '#c6e48b',
  '#7bc96f',
  '#239a3b',
  '#196127'
];
const emptyColor = '#000000';

export function Heatmap(props: HeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    values,
    startDate,
    endDate,
    cellSize = 16,
    colorMode
  } = props;

  const valueMap = new Map(values.map((value) => [value.date, value.count]));
  const days = eachDay(startDate, endDate);
  const leadingEmptyDays = new Date(`${startDate}T00:00:00.000Z`).getUTCDay();
  const max = Math.max(1, ...values.map((value) => value.count));

  let colors = defaultColors;
  if (colorMode == 'discrete') {
    colors = props.colors?.length ? props.colors : defaultColors;
  } else {
    colors = gradientColors(props.minColor ?? defaultColors[0], props.maxColor ?? defaultColors[defaultColors.length - 1], props.numColors);
  }

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    scrollElement.scrollLeft = scrollElement.scrollWidth;
  }, [days.length, cellSize]);

  return (
    <div className="w-full min-w-0 border border-line p-3">
      <div className="w-full overflow-x-auto" ref={scrollRef}>
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
        {Array.from({ length: leadingEmptyDays }, (_, index) => (
          <span
            aria-hidden="true"
            className="block"
            key={`empty-${index}`}
            style={{ width: cellSize, height: cellSize }}
          />
        ))}
        {days.map((date) => {
          const count = valueMap.get(date) ?? 0;
          return (
            <Tooltip content={`${count} edit${count == 1 ? '' : 's'} on ${date}`} key={date}>
              <span className="block border border-line"
                style={{ backgroundColor: colorFor(count, max, colors), width: cellSize, height: cellSize }}
              />
            </Tooltip>
          );
        })}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-muted">
        <span>Less</span>
        {[emptyColor, ...colors].map((color, index) => (
          <span
            aria-label={index == 0 ? "No activity" : `Activity level ${index}`}
            className="block border border-line"
            key={`${color}-${index}`}
            style={{ backgroundColor: color, width: cellSize, height: cellSize }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function eachDay(startDate: string, endDate: string) {
  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

function colorFor(count: number, max: number, colors: string[]) {
  if (count <= 0) return emptyColor;
  const index = Math.min(colors.length - 1, Math.max(0, Math.ceil((count / max) * colors.length) - 1));
  return colors[index];
}

function gradientColors(minColor: string, maxColor: string, numColors: number) {
  const steps = Math.max(1, Math.floor(numColors));
  const start = hexToRgb(minColor) ?? hexToRgb(defaultColors[0])!;
  const end = hexToRgb(maxColor) ?? hexToRgb(defaultColors[defaultColors.length - 1])!;

  if (steps == 1) return [rgbToHex(end)];

  return Array.from({ length: steps }, (_, index) => {
    const ratio = index / (steps - 1);
    return rgbToHex({
      r: Math.round(start.r + (end.r - start.r) * ratio),
      g: Math.round(start.g + (end.g - start.g) * ratio),
      b: Math.round(start.b + (end.b - start.b) * ratio),
    });
  });
}

function hexToRgb(color: string) {
  const hex = color.trim().replace(/^#/, '');
  const normalized = hex.length == 3
    ? hex.split('').map((character) => character + character).join('')
    : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}
