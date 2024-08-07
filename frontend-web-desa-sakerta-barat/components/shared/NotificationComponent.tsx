import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useWebSocket } from '../../app/context/WebSocketContext';
import {
  fetchNotifications,
  markAsRead,
  Notification,
} from '../../lib/actions/notification.action';

const NotificationComponent: React.FC = () => {
  const { socket } = useWebSocket();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 0,
    cacheTime: 0,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<Notification[]>(
        ['notifications'],
        (oldData) =>
          oldData?.map((notification) => ({
            ...notification,
            recipients:
              notification.recipients?.map((recipient) =>
                recipient.notificationId === notificationId
                  ? { ...recipient, isRead: true }
                  : recipient,
              ) ?? [],
          })) ?? [],
      );
    },
  });

  const handleNewNotification = useCallback(
    (newNotification: Notification) => {
      queryClient.setQueryData<Notification[]>(
        ['notifications'],
        (oldData = []) => [newNotification, ...oldData],
      );
      toast({
        title: 'Notifikasi Baru',
        description: newNotification.content,
      });
    },
    [queryClient],
  );

  useEffect(() => {
    if (socket) {
      socket.on('notification', handleNewNotification);
      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [socket, handleNewNotification]);

  const unreadCount = notifications.filter(
    (n) => n.recipients?.some((r) => !r.isRead) ?? false,
  ).length;

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter(
          (n) => n.recipients?.some((r) => !r.isRead) ?? false,
        );

  const handleNotificationClick = (notificationId: number) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && notification.recipients?.some((r) => !r.isRead)) {
      markAsReadMutation.mutate(notificationId);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative p-0 h-8 w-8 mr-1"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon className="h-4 w-4 text-[#A3AED0]" icon={faBell} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-edit transform translate-x-1/2 -translate-y-1/2 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="p-4 bg-gray-50">
            <h3 className="text-lg text-[#2B3674] font-semibold mb-3">
              Notifikasi
            </h3>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-1 rounded-full ${activeTab === 'all' ? 'bg-[#F4F7FE] text-[#6387F3]' : 'text-black-2'}`}
                onClick={() => setActiveTab('all')}
              >
                Semua
              </button>
              <button
                className={`px-3 py-1  rounded-full ${activeTab === 'unread' ? 'bg-[#F4F7FE] text-[#6387F3]' : 'text-black-2'}`}
                onClick={() => setActiveTab('unread')}
              >
                Belum di baca
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <p className="p-4 text-gray-500">Tidak ada notifikasi</p>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 text-sm border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <p
                    className={
                      notification.recipients?.some((r) => !r.isRead)
                        ? 'font-semibold text-black-2'
                        : 'text-gray-600'
                    }
                  >
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {/* Add timestamp here if available */}
                    {/* {formatDate(notification.createdAt)} */}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
