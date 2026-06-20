import { Tooltip } from "@/components/ui/tooltip";

type HeatmapValue = { date: string; count: number };

export function Heatmap({ values, startDate, endDate, colors = ["#1d1d1d", "#3f2a08", "#7c4a03", "#f59e0b"] }: { values: HeatmapValue[]; startDate: string; endDate: string; colors?: string[] }) {
  const valueMap = new Map(values.map((value) => [value.date, value.count]));
  const days = eachDay(startDate, endDate);
  const max = Math.max(1, ...values.map((value) => value.count));

  return (
    <div className="overflow-x-auto pb-1">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
        {days.map((date) => {
          const count = valueMap.get(date) ?? 0;
          return (
            <Tooltip content={`${count} additions or edits on ${date}`} key={date}>
              <span className="block size-3 border border-line" style={{ backgroundColor: colorFor(count, max, colors) }} />
            </Tooltip>
          );
        })}
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
  if (count <= 0) return colors[0];
  const index = Math.min(colors.length - 1, Math.ceil((count / max) * (colors.length - 1)));
  return colors[index];
}
