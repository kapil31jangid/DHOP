import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { toast } from 'sonner';

export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for postgres changes globally
    const channel = supabase
      .channel('public-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medicines' },
        (payload) => {
          console.log('[Realtime Sync] Medicines table modified:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: ['medicines'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-medicines'] });
          queryClient.invalidateQueries({ queryKey: ['facility-medicines'] });
          
          const isCritical =
            (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') &&
            payload.new.quantity <= payload.new.threshold;

          if (isCritical) {
            toast.warning(`Critical Inventory Alert: ${payload.new.name} is running below threshold (${payload.new.quantity} remaining)`);
          } else if (payload.eventType === 'INSERT') {
            toast.info(`Medicine batch stock added: ${payload.new.name}`);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'beds' },
        (payload) => {
          console.log('[Realtime Sync] Beds table modified:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: ['beds'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-beds'] });
          queryClient.invalidateQueries({ queryKey: ['facility-beds'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          console.log('[Realtime Sync] Attendance table modified:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: ['attendance'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-attendance'] });
          queryClient.invalidateQueries({ queryKey: ['facility-attendance'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('[Realtime Sync] Notifications table modified:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          if (payload.eventType === 'INSERT') {
            toast.info(`New System Alert: ${payload.new.title}`);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          console.log('[Realtime Sync] Reports table modified:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch((err) => {
        console.warn('[Realtime Sync] Cleanup warning:', err.message);
      });
    };
  }, [queryClient]);
}
