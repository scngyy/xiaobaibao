import { Photo } from './types';
import { getLocalPhotos, getPhotosByFilenames, filterExistingPhotos } from './utils/imageUtils';

// ==========================================
// 自动本地图片加载配置
// ==========================================
// 应用会自动扫描 public/photos 文件夹中的所有图片文件
// 支持的格式：.jpg, .jpeg, .png, .gif, .webp, .bmp, .svg
// 无需手动配置，只需将图片放入文件夹即可

const LOCAL_FOLDER_PATH = '/photos';

/**
 * 异步获取所有可用的本地图片
 * 这个函数会自动扫描并返回public/photos文件夹中的所有图片
 */
export async function getAllPhotos(): Promise<Photo[]> {
    try {
        // 首先尝试使用动态导入获取图片
        let photos = await getLocalPhotos();
        
        // 如果动态导入没有找到图片，使用备用方法
        if (photos.length === 0) {
            photos = getPhotosByFilenames();
            // 过滤出真实存在的图片
            photos = await filterExistingPhotos(photos);
        }
        
        console.log(`成功加载 ${photos.length} 张本地图片`);
        return photos;
    } catch (error) {
        console.error('加载本地图片时出错:', error);
        return [];
    }
}

/**
 * 同步获取默认图片列表（作为备用）
 * 这个函数提供一些常见的图片文件名
 */
export function getDefaultPhotos(): Photo[] {
    return getPhotosByFilenames();
}

// 向后兼容性：导出一个空的PHOTOS数组
// 现在推荐使用 getAllPhotos() 来获取动态图片列表
export const PHOTOS: Photo[] = [];

export const THEME = {
  colors: {
    primary: '#ff10f0', // Neon Hot Pink
    secondary: '#ff99cc', // Soft Pastel Pink
    tertiary: '#ccffff', // Icy White/Blue
    accent: '#ffeebb', // Warm Starlight Gold
    ribbon: '#d8b4fe', // Lavender
  }
};

export const TREE_CONFIG = {
  height: 15,
  radius: 6.5,
  particleCount: 12000, 
  lightCount: 800,
};
