// 封装一个图片下载保存到本地方法
import fs from 'fs';
import os from 'os';
import axios from 'axios';
import path from 'path';
// 获取URL文件名
const getFileName = (url: string) => {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').pop() || '';
};

// 定义返回类型
interface DownloadResult {
  filePath: string;
  url: string;
  deleteFile: () => void;
}

export const downloadFile = async (url: string): Promise<DownloadResult> => {
  const response = await axios.get(url, {
    responseType: 'stream',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  });

  const filePath = path.join(os.tmpdir(), getFileName(url));

  return new Promise<DownloadResult>((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);

    writer.on('finish', () => {
      resolve({
        filePath,
        url,
        deleteFile: () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        },
      });
    });

    writer.on('error', (err) => {
      reject(err);
    });

    response.data.pipe(writer);
  });
};

// 定义文件类型常量
const FILE_TYPES = {
  IMAGE: 'image',
  VOICE: 'voice',
  VIDEO: 'video',
  THUMB: 'thumb',
};

// 扩展名到类型的映射
const EXT_TO_TYPE = {
  // 图片
  '.jpg': FILE_TYPES.IMAGE,
  '.jpeg': FILE_TYPES.IMAGE,
  '.png': FILE_TYPES.IMAGE,
  '.gif': FILE_TYPES.IMAGE,
  '.bmp': FILE_TYPES.IMAGE,
  '.webp': FILE_TYPES.IMAGE,
  // 音频
  '.mp3': FILE_TYPES.VOICE,
  '.wav': FILE_TYPES.VOICE,
  '.ogg': FILE_TYPES.VOICE,
  // 视频
  '.mp4': FILE_TYPES.VIDEO,
  '.avi': FILE_TYPES.VIDEO,
  '.mkv': FILE_TYPES.VIDEO,
  '.mov': FILE_TYPES.VIDEO,
  '.flv': FILE_TYPES.VIDEO,
  // 缩略图 (一般为图片的特殊处理)
  '.thumb': FILE_TYPES.THUMB,
};

export const getFileType = (mimeType: string) => {
  // 基于 MIME 类型进行判断
  if (mimeType.startsWith('image/')) {
    return FILE_TYPES.IMAGE;
  }
  if (mimeType.startsWith('audio/')) {
    return FILE_TYPES.VOICE;
  }
  if (mimeType.startsWith('video/')) {
    return FILE_TYPES.VIDEO;
  }
  if (mimeType === 'application/octet-stream' || mimeType === 'image/thumbnail') {
    return FILE_TYPES.THUMB; // 特别处理缩略图类型
  }

  return '';
};

/**
 * 获取文件类型的方法
 * @param file - 可以是文件的 URL 或者 `File` 对象
 * @returns 返回文件类型：image, voice, video, thumb
 */
export function getSourceFileType(file: string | File): string {
  if (typeof file === 'string') {
    // 如果是 URL，使用后缀名判断文件类型
    const extname = path.extname(file).toLowerCase();
    // @ts-ignore
    return (EXT_TO_TYPE[extname] as string) || '';
  }

  // 如果是 File 对象，读取 MIME 类型
  const mimeType = file.type.toLowerCase();

  return getFileType(mimeType);
}

/**
 * 获取 URL 中的所有参数
 * @param {string} link 需要解析的 URL
 * @returns {Object} 包含所有参数的对象，如果没有参数则返回空对象
 */
export function getAllURLParameters(link: string): any {
  const paramsObj: Record<string, string> = {};

  try {
    // 如果没有协议前缀，默认加上 `http://`
    const url = link.startsWith('http://') || link.startsWith('https://') ? link : `http://${link}`;

    // 提取 `?` 和 `#` 后的参数部分
    const queryString = url.split('?')[1]?.split('#')[0] || ''; // 获取 `?` 后的部分
    const hashString = url.split('#')[1]?.split('?')[1] || ''; // 获取 `#` 后 `?` 后的部分

    // 合并 `queryString` 和 `hashString`
    const fullString = `${queryString}&${hashString}`.replace(/^&|&$/g, ''); // 去除多余的 `&`

    // 解析参数
    fullString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key) {
        paramsObj[key] = decodeURIComponent(value || '');
      }
    });
  } catch (e) {
    console.error('Invalid URL:', e);
  }

  return paramsObj;
}
