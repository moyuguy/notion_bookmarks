'use client';

import { Link } from '@/types';
import { motion } from 'framer-motion';
import { IconExternalLink } from '@tabler/icons-react';
import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
  FALLBACK_ICON_SRC,
  ICON_LOAD_TIMEOUT_MS,
  getFailedIconState,
  getInitialIconState,
  getLoadedIconState,
  getTimedOutIconState,
} from '@/lib/link-icon';

interface LinkCardProps {
  link: Link;
  className?: string;
}

// 提示框组件 - 保持不变，可以考虑提取但此处暂保留
function Tooltip({ content, show, x, y }: { content: string; show: boolean; x: number; y: number }) {
  if (!show) return null;
  
  // 确保在客户端环境中执行
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  
  return createPortal(
    <div 
      className="fixed p-2 rounded-lg bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85
                border shadow-lg max-w-xs z-[100] pointer-events-none
                animate-in fade-in zoom-in-95 duration-200"
      style={{ 
        left: x,
        top: y - 8,
        transform: 'translateY(-100%)'
      }}
    >
      <p className="text-sm text-popover-foreground whitespace-normal">{content}</p>
    </div>,
    document.body
  );
}

// 分离 Image 组件以避免整个 LinkCard 重渲染
const OptimisedLinkIcon = memo(function OptimisedLinkIcon({ 
  src, 
  alt, 
  onLoad, 
  onError 
}: { 
  src: string; 
  alt: string; 
  onLoad?: () => void; 
  onError: () => void;
}) {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const image = imageRef.current;
        if (!image) return;

        const reportImageStatus = () => {
            if (!image.complete) return false;

            if (image.naturalWidth > 0) {
                onLoad?.();
            } else {
                onError();
            }

            return true;
        };

        if (reportImageStatus()) return;

        let attempts = 0;
        const intervalId = window.setInterval(() => {
            attempts += 1;
            if (reportImageStatus() || attempts >= 30) {
                window.clearInterval(intervalId);
            }
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [src, onLoad, onError]);

    return (
        // 这里刻意使用原生 img，避免 Vercel Image Optimization 免费额度消耗。
        // eslint-disable-next-line @next/next/no-img-element
        <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={cn(
                "w-full h-full object-contain transition-opacity duration-200"
            )}
            onLoad={onLoad}
            onError={onError}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
        />
    );
}, (prev, next) => prev.src === next.src && prev.alt === next.alt);


const LinkCard = memo(function LinkCard({ link, className }: LinkCardProps) {
  const [titleTooltip, setTitleTooltip] = useState({ show: false, x: 0, y: 0 });
  const [descTooltip, setDescTooltip] = useState({ show: false, x: 0, y: 0 });
  const [iconState, setIconState] = useState(() => getInitialIconState(link));
  const iconContainerRef = useRef<HTMLDivElement>(null);

    // 使用 useCallback 优化事件处理
    const handleImageError = useCallback(() => {
        setIconState(getFailedIconState());
    }, []);

    const handleImageLoad = useCallback(() => {
        setIconState((state) => getLoadedIconState(state));
    }, []);

  const handleMouseEnter = useCallback((
    event: React.MouseEvent<HTMLElement>,
    isTitle: boolean
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const setter = isTitle ? setTitleTooltip : setDescTooltip;
    setter({
      show: true,
      x: rect.left,
      y: rect.top
    });
  }, []);

  const handleMouseLeave = useCallback((isTitle: boolean) => {
      const setter = isTitle ? setTitleTooltip : setDescTooltip;
    setter({ show: false, x: 0, y: 0 });
  }, []);

  // 当 link 变化时更新图片源
  useEffect(() => {
    setIconState(getInitialIconState(link));
  }, [link]);

  useEffect(() => {
    if (iconState.isLoaded || iconState.src === FALLBACK_ICON_SRC) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIconState((state) => {
        if (state.isLoaded || state.src === FALLBACK_ICON_SRC) {
          return state;
        }

        return getTimedOutIconState(state);
      });
    }, ICON_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [iconState.isLoaded, iconState.src]);

  useEffect(() => {
    if (!iconState.showFallback) return;

    const syncImageStatus = () => {
      const image = iconContainerRef.current?.querySelector('img');
      if (!image?.complete) return false;

      if (image.naturalWidth > 0) {
        setIconState((state) => getLoadedIconState(state));
      } else {
        setIconState(getFailedIconState());
      }

      return true;
    };

    if (syncImageStatus()) return;

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      if (syncImageStatus() || attempts >= 30) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [iconState.showFallback]);

  return (
    <>
    <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group block p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all",
          "hover:shadow-lg hover:shadow-primary/5",
          "w-full max-w-full",
          className
        )}
      >
        {/* 内容容器 */}
        <div className="flex flex-col h-full gap-2">
          {/* 图标和名称行 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* 图标容器 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-10 h-10 rounded-xl overflow-hidden transition-all shrink-0
                       bg-muted/50 p-1.5 border border-border/50"
            >
              <div ref={iconContainerRef} className="icon-container relative w-full h-full">
                {iconState.showFallback && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-center bg-contain bg-no-repeat opacity-70"
                    style={{ backgroundImage: `url(${FALLBACK_ICON_SRC})` }}
                  />
                )}
                <OptimisedLinkIcon 
                    src={iconState.src} 
                    alt={link.name} 
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                 
                {iconState.showSpinner && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* 网站名称和图标 */}
            <div className="flex-1 min-w-0 relative">
              <div 
                className="relative"
                onMouseEnter={(e) => handleMouseEnter(e, true)}
                onMouseLeave={() => handleMouseLeave(true)}
              >
                <h3 className="text-lg text-foreground
                               group-hover:text-primary
                               transition-colors line-clamp-1 pr-6">
                  {link.name}
                </h3>
              </div>
              {/* 固定位置的外链图标 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <IconExternalLink 
                  className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
          </div>

          {/* 描述行 */}
          {link.desc && (
            <div 
              className="relative flex-1 min-h-0"
              onMouseEnter={(e) => handleMouseEnter(e, false)}
              onMouseLeave={() => handleMouseLeave(false)}
            >
              <p className="text-sm text-foreground/80
                         group-hover:text-foreground
                         line-clamp-2 transition-colors">
                {link.desc}
              </p>
            </div>
          )}

          {/* 标签行 - 放在底部 */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 flex-shrink-0">
              {link.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'link-tag inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/90 transition-colors',
                    tag.includes('力荐') && 'link-tag-featured'
                  )}
                  title={tag}
                >
                  <span className="link-tag-label truncate max-w-[80px]">{tag}</span>
                </span>
              ))}
              {link.tags.length > 3 && (
                <span className="link-tag inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/90 transition-colors shrink-0"
                >
                  +{link.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 渐变悬浮效果 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-transparent
                      group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-transparent
                      transition-colors duration-500" />
      </motion.a>

      {/* 提示框 */}
      <Tooltip 
        content={link.name}
        show={titleTooltip.show}
        x={titleTooltip.x}
        y={titleTooltip.y}
      />
      {link.desc && (
        <Tooltip 
          content={link.desc}
          show={descTooltip.show}
          x={descTooltip.x}
          y={descTooltip.y}
        />
      )}
    </>
  );
}, (prev, next) => {
    // Custom comparison function for React.memo
    // Only re-render if key props change
    return (
        prev.link.id === next.link.id &&
        prev.link.name === next.link.name &&
        prev.link.desc === next.link.desc &&
        prev.link.url === next.link.url &&
        prev.link.iconfile === next.link.iconfile &&
        prev.link.iconlink === next.link.iconlink &&
        prev.className === next.className
    );
});

export default LinkCard;
