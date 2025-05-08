import { BaseHttp } from './base.http';
import { getSourceFileType } from './tool';
import { MaterialUploadOptions } from './type';
import util from 'util';

// 素材管理
/**
 * 新增素材
 * options.isPermanent 是否永久
 * options.media 媒体文件的本地路径、URL或Fastify上传的文件对象
 * options.type 素材类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * options.filename 文件名
 * options.description 描述
 * options.fieldName 表单字段名，默认为'media'
 * options.headers 请求头
 * options.access_token 公众号的access_token
 * 临时素材media_id是可复用的，媒体文件在微信后台保存时间为3天，即3天后media_id失效
 * 文件大小限制：
 * - 图片（image）: 10M，支持PNG\JPEG\JPG\GIF格式
 * - 语音（voice）：2M，播放长度不超过60s，支持AMR\MP3格式
 * - 视频（video）：10MB，支持MP4格式
 * - 缩略图（thumb）：64KB，支持JPG格式
 */
export const addMaterial = async <T>({ access_token, media, type, filename, description, fieldName, isPermanent, headers }: MaterialUploadOptions): Promise<T> => {
  const filetype = typeof media === 'string' ? getSourceFileType(media) : type;
  const url = isPermanent ? util.format('/cgi-bin/material/add_material?access_token=%s&type=%s', access_token, filetype) : util.format('/cgi-bin/media/upload?access_token=%s&type=%s', access_token, filetype);
  // 如果media是字符串，按照路径处理
  if (typeof media === 'string') {
    // 判断media是否是http链接
    if (media.startsWith('http')) {
      let videoDescription = description || '';
      // 如果是永久视频素材，且没有描述，则生成随机描述
      if (filetype == 'video' && isPermanent && !description) {
        const randomFiveDigit = Math.floor(Math.random() * 90000) + 10000;
        videoDescription = JSON.stringify({ title: `素材视频-${randomFiveDigit}`, introduction: `素材视频介绍${randomFiveDigit}` });
      }
      return (await BaseHttp.getInstance().uploadMediaFromUrl(url, media, {
        headers: headers,
        description: videoDescription,
      })) as T;
    }
    // 使用本地文件路径上传
  }
  return (await BaseHttp.getInstance().uploadMedia(url, { media, filename, description, fieldName })) as T;
};

/**
 * 获取临时素材
 * @param access_token 公众号的access_token
 * @param media_id 媒体id
 * @returns 返回结果包含media_id等信息
 */
export const getTemporaryMaterial = async <T>(access_token: string, media_id: string): Promise<T> => {
  const url = util.format('/cgi-bin/media/get?access_token=%s&media_id=%s', access_token, media_id);
  return await BaseHttp.get(url);
};

/**
 * 获取永久素材
 * @param access_token 公众号的access_token
 * @param media_id 媒体id
 * @returns 返回结果包含media_id等信息
 */
export const getPermanentMaterial = async <T>(access_token: string, media_id: string): Promise<T> => {
  const url = util.format('/cgi-bin/material/get_material?access_token=%s&media_id=%s', access_token);
  return await BaseHttp.post(url, { media_id });
};

/**
 * 删除永久素材
 * @param access_token 公众号的access_token
 * @param media_id 媒体id
 * @returns 返回结果包含media_id等信息
 */
export const deletePermanentMaterial = async <T>(access_token: string, media_id: string): Promise<T> => {
  const url = util.format('/cgi-bin/material/del_material?access_token=%s', access_token);
  return await BaseHttp.post(url, { media_id });
};

/**
 * 获取素材总数
 * @param access_token 公众号的access_token
 * @returns 返回结果包含素材总数
 */
export const getMaterialCount = async <T>(access_token: string): Promise<T> => {
  const url = util.format('/cgi-bin/material/get_materialcount?access_token=%s', access_token);
  return await BaseHttp.get(url);
};

/**
 * 获取素材列表
 * @param access_token 公众号的access_token
 * @param type 素材类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * @param offset 从全部素材的该偏移位置开始返回，0表示从第一个素材返回
 * @param count 返回素材的数量，取值在1到20之间
 * @returns 返回结果包含素材列表
 */
export const getMaterialList = async <T>(access_token: string, type: string, offset: number, count: number): Promise<T> => {
  const url = util.format('/cgi-bin/material/batchget_material?access_token=%s', access_token);
  return await BaseHttp.post(url, { type, offset, count });
};
