import { format, formatDistanceToNow, isAfter } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy • HH:mm');
};

export const formatRelative = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isUpcoming = (date) => isAfter(new Date(date), new Date());

export const getInitials = (firstName, lastName) => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
};

export const getCategoryClass = (cat) => `cat-${cat || 'other'}`;

export const categoryLabels = {
  academic: 'Academic',
  cultural: 'Cultural',
  sports: 'Sports',
  workshop: 'Workshop',
  conference: 'Conference',
  club: 'Club',
  other: 'Other',
};

export const newsCategories = {
  announcement: 'Announcement',
  academic: 'Academic',
  administrative: 'Administrative',
  achievement: 'Achievement',
  general: 'General',
};

export const statusConfig = {
  present: { label: 'Present', cls: 'badge-green', dot: 'status-present' },
  absent:  { label: 'Absent',  cls: 'badge-red',   dot: 'status-absent'  },
  unknown: { label: 'Unknown', cls: 'badge-gray',  dot: 'status-unknown' },
};

export const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
