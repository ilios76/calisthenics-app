import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardEntry {
  rank: number;
  username: string;
  value: number;
  userId: string;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  globalEntries: LeaderboardEntry[];
  friendsEntries: LeaderboardEntry[];
  weeklyEntries: LeaderboardEntry[];
  currentUserId: string;
  onUserClick: (userId: string) => void;
}

export function Leaderboard({
  globalEntries,
  friendsEntries,
  weeklyEntries,
  currentUserId,
  onUserClick,
}: LeaderboardProps) {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-gray-600 w-5 text-center">{rank}</span>;
    }
  };

  const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <div className="space-y-2">
      {entries.map((entry) => (
        <button
          key={entry.userId}
          onClick={() => onUserClick(entry.userId)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            entry.isCurrentUser
              ? 'bg-blue-100 border-2 border-blue-400'
              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <div className="flex-shrink-0 w-6 flex justify-center">
            {getMedalIcon(entry.rank)}
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {entry.username.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 text-left">
            <p className={`font-semibold text-sm ${entry.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
              {entry.username}
              {entry.isCurrentUser && <span className="text-xs ml-2 text-blue-600">(You)</span>}
            </p>
            <p className="text-xs text-gray-600">Rank #{entry.rank}</p>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg text-blue-600">{entry.value}</p>
            <p className="text-xs text-gray-600">points</p>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Leaderboards</h2>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">Top performers all-time</p>
          <LeaderboardTable entries={globalEntries} />
        </TabsContent>

        <TabsContent value="friends" className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">Compete with your friends</p>
          {friendsEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Add friends to see their rankings</p>
            </div>
          ) : (
            <LeaderboardTable entries={friendsEntries} />
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">This week's top performers</p>
          <LeaderboardTable entries={weeklyEntries} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
