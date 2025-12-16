import { Photo } from '../types';

// 支持的图片扩展名
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

/**
 * 获取public/photos文件夹中的所有图片文件
 * 使用Vite的动态导入功能来扫描图片文件
 */
export async function getLocalPhotos(): Promise<Photo[]> {
    try {
        // 使用Vite的glob模式来匹配图片文件
        const imageModules = import.meta.glob('/public/photos/**/*.{jpg,jpeg,png,gif,webp,bmp,svg}', { 
            eager: false,
            query: '?url'
        });
        
        const photos: Photo[] = [];
        let id = 0;
        
        for (const path in imageModules) {
            try {
                // 从路径中提取文件名
                const filename = path.split('/').pop() || '';
                
                // 动态导入获取图片URL
                const module = await imageModules[path]();
                const url = (module as any).default;
                
                // 确保URL有效
                if (url && typeof url === 'string') {
                    photos.push({
                        id: id++,
                        url: url,
                        width: 3,
                        height: 4
                    });
                }
            } catch (moduleError) {
                console.warn(`无法加载图片 ${path}:`, moduleError);
            }
        }
        
        console.log(`通过动态导入找到 ${photos.length} 张图片`);
        return photos;
    } catch (error) {
        console.error('动态导入获取本地图片失败:', error);
        return [];
    }
}

/**
 * 备用方法：通过预设的常见文件名获取图片
 * 当动态导入不可用时使用此方法
 */
export function getPhotosByFilenames(): Photo[] {
    const commonFilenames = [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg',
        '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg',
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg',
        'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg',
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'
    ];
    
    return commonFilenames.map((filename, i) => ({
        id: i,
        url: `/photos/${filename}`,
        width: 3,
        height: 4
    }));
}

/**
 * 检查图片文件是否存在
 */
export async function checkImageExists(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * 过滤出真实存在的图片
 */
export async function filterExistingPhotos(photos: Photo[]): Promise<Photo[]> {
    const existingPhotos: Photo[] = [];
    
    for (const photo of photos) {
        if (await checkImageExists(photo.url)) {
            existingPhotos.push(photo);
        }
    }
    
    return existingPhotos;
}
