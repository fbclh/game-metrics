export type PlayListStatus = 'want_to_play' | 'playing' | 'finished';

export interface PlayListItem {
  id: string;
  session_id: string;
  game_id: number;
  game_name: string;
  cover_url: string | null;
  status: PlayListStatus;
  created_at: string;
}

const PLAY_LIST_STATUSES: PlayListStatus[] = [
  'want_to_play',
  'playing',
  'finished',
];

export function isPlayListStatus(value: unknown): value is PlayListStatus {
  return (
    typeof value === 'string' &&
    PLAY_LIST_STATUSES.includes(value as PlayListStatus)
  );
}

export const PLAYLIST_STATUS_LABELS: Record<PlayListStatus, string> = {
  want_to_play: 'Want to Play',
  playing: 'Playing',
  finished: 'Finished',
};

export const PLAYLIST_TABS: { status: PlayListStatus; label: string }[] = [
  { status: 'want_to_play', label: 'Want to Play' },
  { status: 'playing', label: 'Playing' },
  { status: 'finished', label: 'Finished' },
];
