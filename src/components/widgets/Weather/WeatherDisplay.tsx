import React, { RefObject } from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { AirQualityBadge } from './AirQualityBadge';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  onToggleSelector: (e: React.MouseEvent) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  children?: React.ReactNode; // For the selector portal
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weatherData,
  onToggleSelector,
  buttonRef,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="widget-card weather-widget p-4 bg-card/80 backdrop-blur-sm text-card-foreground w-[220px] h-[150px] flex flex-col justify-between relative overflow-hidden group"
      suppressHydrationWarning
    >
      {/* Background Decor */}
      <div className="weather-background-decor absolute inset-0 opacity-10 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none transition-opacity group-hover:opacity-20"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{weatherData.temperature}°</h3>
          <div className="text-sm text-muted-foreground flex items-center">
            {weatherData.location}
            <div className="relative">
              <button 
                ref={buttonRef}
                onClick={onToggleSelector}
                className="weather-location-trigger text-xs p-1 rounded-full hover:bg-primary/10 focus:outline-none transition-colors"
                title="更改位置"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="weather-location-icon text-primary">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </button>
              {children}
            </div>
          </div>
        </div>
        <div className="weather-icon text-primary">
          <WeatherIcon icon={weatherData.icon} className="text-3xl" />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-sm text-foreground">{weatherData.condition}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">{weatherData.tempMin}° ~ {weatherData.tempMax}°</p>
          
          <AirQualityBadge 
            aqi={weatherData.aqi} 
            category={weatherData.aqiCategory} 
          />
        </div>
      </div>
    </motion.div>
  );
};
