'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { Settings as SettingsIcon, Lock, User } from 'lucide-react';

interface AdminSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminSettings({ open, onOpenChange }: AdminSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Current password is required',
      });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'New password must be at least 6 characters',
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'New passwords do not match',
      });
      return;
    }

    if (!newUsername && !newPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a new username or password',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Your credentials have been updated successfully',
        });
        
        // Clear form
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        
        // If username changed, logout for security
        if (newUsername && newUsername !== admin?.username) {
          setTimeout(() => {
            logout();
            onOpenChange(false);
            window.location.reload();
          }, 1500);
        } else {
          onOpenChange(false);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to update credentials',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Admin Settings
          </DialogTitle>
          <DialogDescription>
            Update your admin credentials. Your current password is required to make changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Current Password *
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newUsername" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              New Username
            </Label>
            <Input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Leave blank to keep current"
              className="border-2"
            />
            {admin && (
              <p className="text-xs text-muted-foreground">
                Current username: <span className="font-medium">{admin.username}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              minLength={6}
              className="border-2"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters long
            </p>
          </div>

          {newPassword && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="border-2"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Credentials'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          {newUsername && newUsername !== admin?.username && (
            <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-3 mt-2">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ You will be automatically logged out after changing your username.
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}