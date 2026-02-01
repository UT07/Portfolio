import { Award, Cloud, Zap, TrendingDown, Cpu, Activity, Music2, Users, Calendar, MapPin } from 'lucide-react';

export const getIcon = (iconName) => {
  const icons = {
    award: Award,
    cloud: Cloud,
    zap: Zap,
    'trending-down': TrendingDown,
    cpu: Cpu,
    activity: Activity,
    music: Music2,
    users: Users,
    calendar: Calendar,
    mappin: MapPin,
  };

  return icons[iconName] || Award;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
