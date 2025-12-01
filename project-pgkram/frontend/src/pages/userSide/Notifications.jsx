import React, { useState } from 'react';
import NotificationDisplay from '../../components/NotificationDisplay'; // Import your existing NotificationDisplay component

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: 'icon1',
      notihead: 'Application sent',
      notivalue: 'Applications for Google companies have entered for company review',
      notitime: '25 minutes ago',
    },
    {
      id: 2,
      icon: 'icon2',
      notihead: 'New Message',
      notivalue: 'You have a new message from John Doe',
      notitime: '1 hour ago',
    },
    // Add more default notifications as needed
  ]);

  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
  };

  return (
   
      <div className="absolute right-[40px] bg-white top-[230px] text-left z-10 w-1/4">
        {notifications.map((notification) => (
          <NotificationDisplay
            key={notification.id}
            notification={notification}
            onDelete={() => removeNotification(notification.id)}
          />
        ))}
      </div>
  );
};

export default NotificationComponent;