import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { GameDetail } from '@/src/components/GameDetail';
import type { GameDetailData } from '@/src/types/game-detail';

type GamePageProps = {
  params: { id: string };
};

async function fetchGameDetail(id: string): Promise<GameDetailData | null> {
  const headersList = headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';

  const response = await fetch(`${protocol}://${host}/api/games/${id}`, {
    cache: 'no-store',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load game.');
  }

  return response.json();
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await fetchGameDetail(params.id);

  if (!game) {
    notFound();
  }

  return <GameDetail game={game} />;
}
