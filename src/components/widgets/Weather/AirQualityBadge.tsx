import React from 'react';
import { AqiCategory, AIR_QUALITY_STYLES } from '@/types/weather';

interface AirQualityBadgeProps {
  aqi?: number;
  category?: string;
  className?: string;
}

export const AirQualityBadge: React.FC<AirQualityBadgeProps> = ({ aqi, category, className = '' }) => {
  if (!aqi || !category) return null;

  const styleClass = AIR_QUALITY_STYLES[category as AqiCategory] || '';

  return (
    <div className={`air-quality-badge flex items-center gap-1 ${className}`}>
      <div 
        className={`air-quality-category px-1.5 py-0.5 rounded text-xs font-medium ${styleClass}`}
      >
        {category}
      </div>
      <span className="air-quality-value font-medium">{aqi}</span>
    </div>
  );
}; // Added missing semicolon
