'use client';

import React, { useEffect, useState } from 'react';
import { Clock, FileText, Users, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'evaluation' | 'contract' | 'employee' | 'alert';
  title: string;
  description: string;
  time: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:7000/activite');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des activités :", error);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'evaluation':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'contract':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'employee':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
