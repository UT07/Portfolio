import React from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, Star } from 'lucide-react';

/**
 * StatusBadge - Visual status indicators
 */
export function StatusBadge({ published, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
        published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      } ${className}`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

/**
 * StatusBadgeWithStatus - Visual status indicators with status string
 */
export default function StatusBadgeWithStatus({ status, className = '' }) {
  const configs = {
    published: {
      icon: Eye,
      label: 'Published',
      classes: 'bg-green-100 text-green-800',
    },
    draft: {
      icon: EyeOff,
      label: 'Draft',
      classes: 'bg-yellow-100 text-yellow-800',
    },
    active: {
      icon: CheckCircle,
      label: 'Active',
      classes: 'bg-green-100 text-green-800',
    },
    inactive: {
      icon: XCircle,
      label: 'Inactive',
      classes: 'bg-gray-100 text-gray-800',
    },
    featured: {
      icon: Star,
      label: 'Featured',
      classes: 'bg-purple-100 text-purple-800',
    },
  };

  const config = configs[status] || configs.draft;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.classes} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

/**
 * PublishToggle - Toggle button for publish/unpublish
 */
export function PublishToggle({ published, onChange, disabled = false }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-10 h-6 rounded-full transition-colors ${
            published ? 'bg-green-500' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              published ? 'translate-x-4' : ''
            }`}
          />
        </div>
      </div>
      <span className={`text-sm ${published ? 'text-green-700' : 'text-gray-600'}`}>
        {published ? 'Published' : 'Draft'}
      </span>
    </label>
  );
}
