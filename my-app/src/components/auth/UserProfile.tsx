'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const { logout } = useAuth();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
