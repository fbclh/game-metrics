export interface TopSearchItem {
  query: string;
  count: number;
}

export interface TopGameItem {
  game_id: number;
  game_name: string;
  count: number;
}

export interface SearchVolumeItem {
  date: string;
  count: number;
}

export interface TrendingItem {
  query: string;
  count: number;
}

export interface ListStats {
  want_to_play: number;
  playing: number;
  finished: number;
  total: number;
}

export type TopSearchesResponse = { data: TopSearchItem[] };
export type TopGamesResponse = { data: TopGameItem[] };
export type SearchVolumeResponse = { data: SearchVolumeItem[] };
export type TrendingResponse = { data: TrendingItem[] };
export type ListStatsResponse = { data: ListStats };

export const CHART_COLORS = {
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  label: '#9ca3af',
  tooltipBg: '#1f2937',
  tooltipBorder: '#374151',
} as const;

export const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: CHART_COLORS.tooltipBg,
    border: `1px solid ${CHART_COLORS.tooltipBorder}`,
    borderRadius: '6px',
  },
  labelStyle: { color: CHART_COLORS.label },
  itemStyle: { color: '#f3f4f6' },
};

export const chartAxisStyle = {
  tick: { fill: CHART_COLORS.label, fontSize: 12 },
  axisLine: false,
  tickLine: false,
};

export const defaultListStats: ListStats = {
  want_to_play: 0,
  playing: 0,
  finished: 0,
  total: 0,
};
