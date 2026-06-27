import { NextResponse } from 'next/server';
import { parse } from 'node-html-parser';

interface HotNewsItem {
  title: string;
  url: string;
  views: string;
  platform: string;
}

interface WeiboItem {
  note: string;
  num: number;
}

interface BaiduItem {
  title: string;
  url?: string;
  hot?: string;
  hot_score?: string;
}

interface BilibiliItem {
  keyword: string;
  hot?: number;
}

interface ToutiaoItem {
  Title: string;
  HotValue: number;
}

interface DouyinItem {
  word: string;
  sentence_id: string;
  hot_value: string;
}

interface CacheData {
  weibo: HotNewsItem[];
  baidu: HotNewsItem[];
  bilibili: HotNewsItem[];
  toutiao: HotNewsItem[];
  douyin: HotNewsItem[];
}

// 内存缓存
let cache: {
  data: CacheData;
  timestamp: number;
} | null = null;

const CACHE_TIME = 15 * 60 * 1000; // 15分钟
const HOT_NEWS_DEBUG = process.env.HOT_NEWS_DEBUG === '1';

function logHotNewsDebug(message: string, details?: unknown) {
  if (!HOT_NEWS_DEBUG) {
    return;
  }

  if (details === undefined) {
    console.debug(message);
    return;
  }

  console.debug(message, details);
}

// 获取微博热搜
async function getWeiboHotNews(): Promise<HotNewsItem[]> {
  try {
    const response = await fetch('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://weibo.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 检查数据结构是否存在
    if (!data || !data.data || !data.data.realtime) {
      logHotNewsDebug('Weibo API response structure changed:', data);
      throw new Error('Invalid response structure');
    }
    
    return data.data.realtime
      .slice(0, 5)
      .map((item: WeiboItem) => ({
        title: item.note,
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.note)}`,
        views: `${(item.num / 10000).toFixed(1)}万`,
        platform: 'weibo'
      }));
  } catch (error) {
    logHotNewsDebug('Failed to fetch Weibo hot news:', error);
    
    // 尝试备用API
    try {
      const backupResponse = await fetch('https://api.vvhan.com/api/hotlist?type=weibo', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!backupResponse.ok) {
        throw new Error(`Backup API HTTP error! status: ${backupResponse.status}`);
      }
      
      const backupData = await backupResponse.json();
      
      if (backupData.success && backupData.data) {
        return backupData.data
          .slice(0, 5)
          .map((item: BaiduItem) => ({
            title: item.title,
            url: item.url || `https://s.weibo.com/weibo?q=${encodeURIComponent(item.title)}`,
            views: item.hot || '热搜',
            platform: 'weibo'
          }));
      }
    } catch (backupError) {
      logHotNewsDebug('Failed to fetch Weibo hot news from backup API:', backupError);
    }
    
    return [];
  }
}

// 获取百度热搜
async function getBaiduHotNews(): Promise<HotNewsItem[]> {
  try {
    const response = await fetch('https://api.iyk0.com/baiduhot');
    const data = await response.json();
    
    if (!data.data) {
      // 如果第一个API失败，尝试备用API
      const backupResponse = await fetch('https://api.vvhan.com/api/hotlist?type=baidu');
      const backupData = await backupResponse.json();
      
      return backupData.data
        .slice(0, 5)
        .map((item: BaiduItem) => ({
          title: item.title,
          url: item.url,
          views: item.hot || '热搜',
          platform: 'baidu'
        }));
    }
    
    return data.data
      .slice(0, 5)
      .map((item: BaiduItem) => ({
        title: item.title,
        url: item.url,
        views: item.hot_score || '热搜',
        platform: 'baidu'
      }));
  } catch (error) {
    logHotNewsDebug('Failed to fetch Baidu hot news:', error);
    // 如果上面都失败了，尝试直接抓取百度页面
    try {
      const response = await fetch('https://top.baidu.com/board?tab=realtime', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = await response.text();
      const root = parse(html);
      
      return root.querySelectorAll('.content_1YWBm')
        .slice(0, 5)
        .map(item => {
          const title = item.querySelector('.c-single-text-ellipsis')?.text?.trim();
          const url = item.querySelector('a')?.getAttribute('href');
          const hot = item.querySelector('.hot-index_1Bl1a')?.text;
          
          return {
            title: title || '',
            url: url || `https://www.baidu.com/s?wd=${encodeURIComponent(title || '')}`,
            views: hot || '热搜',
            platform: 'baidu'
          };
        });
    } catch (backupError) {
      logHotNewsDebug('Failed to fetch Baidu hot news from backup:', backupError);
      return [];
    }
  }
}

// 获取B站热搜
async function getBilibiliHotNews(): Promise<HotNewsItem[]> {
  try {
    const response = await fetch('https://api.bilibili.com/x/web-interface/search/square?limit=10');
    const data = await response.json();
    
    return data.data.trending.list
      .slice(0, 5)
      .map((item: BilibiliItem) => ({
        title: item.keyword,
        url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(item.keyword)}`,
        views: `${item.hot || '热'}`,
        platform: 'bilibili'
      }));
  } catch (error) {
    logHotNewsDebug('Failed to fetch Bilibili hot news:', error);
    // 备用API
    try {
      const backupResponse = await fetch('https://api.vvhan.com/api/hotlist?type=bili');
      const backupData = await backupResponse.json();
      
      return backupData.data
        .slice(0, 5)
        .map((item: BaiduItem) => ({
          title: item.title,
          url: item.url || `https://search.bilibili.com/all?keyword=${encodeURIComponent(item.title)}`,
          views: `${item.hot || '热'}`,
          platform: 'bilibili'
        }));
    } catch (backupError) {
      logHotNewsDebug('Failed to fetch Bilibili hot news from backup:', backupError);
      return [];
    }
  }
}

// 获取头条热搜
async function getToutiaoHotNews(): Promise<HotNewsItem[]> {
  try {
    const response = await fetch('https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc');
    const data = await response.json();
    
    return data.data
      .slice(0, 5)
      .map((item: ToutiaoItem) => ({
        title: item.Title,
        url: `https://www.toutiao.com/search/?keyword=${encodeURIComponent(item.Title)}`,
        views: `${(item.HotValue / 10000).toFixed(1)}万`,
        platform: 'toutiao'
      }));
  } catch (error) {
    logHotNewsDebug('Failed to fetch Toutiao hot news:', error);
    return [];
  }
}

// 获取抖音热搜
async function getDouyinHotNews(): Promise<HotNewsItem[]> {
  try {
    const response = await fetch('https://aweme.snssdk.com/aweme/v1/hot/search/list/');
    const data = await response.json();
    
    if (data.status_code === 0) {
      return data.data.word_list
        .slice(0, 5)
        .map((item: DouyinItem) => ({
          title: item.word,
          url: `https://www.douyin.com/hot/${encodeURIComponent(item.sentence_id)}`,
          views: `${(Number(item.hot_value) / 10000).toFixed(1)}万`,
          platform: 'douyin'
        }));
    }
    return [];
  } catch (error) {
    logHotNewsDebug('Failed to fetch Douyin hot news:', error);
    // 如果官方API失败，尝试备用API
    try {
      const backupResponse = await fetch('https://api.vvhan.com/api/hotlist?type=douyin');
      const backupData = await backupResponse.json();
      
      return backupData.data
        .slice(0, 5)
        .map((item: BaiduItem) => ({
          title: item.title,
          url: `https://www.douyin.com/search/${encodeURIComponent(item.title)}`,
          views: item.hot || '热搜',
          platform: 'douyin'
        }));
    } catch (backupError) {
      logHotNewsDebug('Failed to fetch Douyin hot news from backup:', backupError);
      return [];
    }
  }
}

// 获取所有平台的热搜
async function getAllHotNews() {
  const [weiboNews, baiduNews, bilibiliNews, toutiaoNews, douyinNews] = await Promise.all([
    getWeiboHotNews(),
    getBaiduHotNews(),
    getBilibiliHotNews(),
    getToutiaoHotNews(),
    getDouyinHotNews()
  ]);

  return {
    weibo: weiboNews,
    baidu: baiduNews,
    bilibili: bilibiliNews,
    toutiao: toutiaoNews,
    douyin: douyinNews
  };
}

// 获取缓存的热搜数据
async function getCachedHotNews() {
  const now = Date.now();
  
  // 如果缓存存在且未过期，直接返回缓存数据
  if (cache && now - cache.timestamp < CACHE_TIME) {
    return cache.data;
  }

  // 获取新数据并更新缓存
  const hotNews = await getAllHotNews();
  cache = {
    data: hotNews,
    timestamp: now
  };
  
  return hotNews;
}

export async function GET() {
  try {
    logHotNewsDebug('Fetching hot news...');
    const hotNews = await getCachedHotNews();
    // console.error('Hot news data:', hotNews);
    return NextResponse.json(hotNews);
  } catch (error) {
    console.error('Error in hot news API:', error);
    return NextResponse.json({ error: 'Failed to fetch hot news' }, { status: 500 });
  }
}
