// 封装http请求
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { MaterialUploadOptions } from '../official-account/type';
import FormData from 'form-data';
import * as fs from 'fs';
import concat from 'concat-stream';
import * as https from 'https';
import * as http from 'http';
import * as path from 'path';

export class Http {
  private instance: AxiosInstance;
  constructor(private baseUrl: string, private RequestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) {
    this.baseUrl = baseUrl;
    this.instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
    if (RequestInterceptors) {
      this.instance.interceptors.request.use(RequestInterceptors);
    }
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (err) => {
        return Promise.reject(err.response);
      },
    );
  }

  async get(url: string, params?: any) {
    return (await this.instance.get(url, { params })) as AxiosResponse['data'];
  }

  async post(url: string, data?: any) {
    return (await this.instance.post(url, data)) as AxiosResponse['data'];
  }

  /**
   * 上传表单数据到指定API端点
   * @param url API端点URL
   * @param options 上传选项对象
   * @param options.file 文件路径、Buffer或ReadStream
   * @param options.fieldName 表单字段名，默认为'media'
   * @param options.description 可选的描述参数
   * @param options.filename 自定义文件名，可选
   * @returns Promise<any> 响应数据
   */
  async postFormData(url: string, options: Omit<MaterialUploadOptions, 'access_token' | 'type' | 'headers'>) {
    return new Promise((resolve, reject) => {
      try {
        const { media, fieldName = 'media', description, filename } = options;

        let formData = new FormData();

        const formHeaders = formData.getHeaders ? formData.getHeaders() : {};

        // 处理文件输入 - 使用更简洁的方式判断类型
        const appendFile = () => {
          // 获取默认文件名
          let actualFilename = filename;

          // 字符串路径
          if (typeof media === 'string') {
            actualFilename = actualFilename || path.basename(media);
            formData.append(fieldName, fs.createReadStream(media), actualFilename);
            return;
          }

          // Buffer对象
          if (Buffer.isBuffer(media)) {
            actualFilename = actualFilename || 'file.bin';
            formData.append(fieldName, media, actualFilename);
            return;
          }

          // 流对象
          const isStream = media && typeof media === 'object' && typeof (media as any).pipe === 'function';
          if (isStream) {
            const filePath = (media as any).path;
            actualFilename = actualFilename || (filePath ? path.basename(filePath) : 'file.bin');
            formData.append(fieldName, media, actualFilename);
            return;
          }

          // 不支持的类型
          throw new Error('不支持的文件类型，请提供有效的文件路径、Buffer或ReadStream');
        };

        // 添加文件到表单
        appendFile();

        // 添加描述参数(如果有)
        if (description) {
          formData.append('description', description);
        }
        formData.pipe(
          concat({ encoding: 'buffer' }, async (data) => {
            this.instance
              .post(url, data, {
                headers: {
                  ...formHeaders,
                  'Content-Type': 'multipart/form-data',
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
              })
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                console.error('请求错误:', error.message || error);
                reject(error);
              });
          }),
        );
      } catch (error) {
        console.error('表单处理错误:', error instanceof Error ? error.message : error);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  /**
   * 从URL链接上传表单数据
   * @param url API端点
   * @param fileUrl 媒体文件的URL
   * @param options 可选参数
   * @param options.fieldName 表单字段名，默认为'media'
   * @param options.headers 请求头
   * @returns Promise
   */
  async postFormDataFromUrl(url: string, fileUrl: string, options: Omit<MaterialUploadOptions, 'access_token' | 'media' | 'type'> = {}) {
    return new Promise((resolve, reject) => {
      // 发起HTTP请求获取文件
      const protocol = fileUrl.startsWith('https') ? https : http;

      // 解析URL以获取主机名和路径
      const urlObj = new URL(fileUrl);
      // 从URL路径中获取文件名
      const filename = path.basename(urlObj.pathname);

      // 准备请求选项
      const requestOptions = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          ...(options.headers || {}),
        },
      };

      const fileRequest = protocol.request(requestOptions, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`获取文件失败: ${response.statusCode}`));
        }

        // 使用数据块收集响应数据
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', async () => {
          try {
            // 将收集到的数据块合并成一个Buffer
            const fileBuffer = Buffer.concat(chunks);

            // 使用已有的postFormData方法上传
            const result = await this.postFormData(url, {
              media: fileBuffer,
              fieldName: options.fieldName || 'media',
              filename,
              description: options.description || '',
            });

            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });

      fileRequest.on('error', (err) => {
        reject(new Error(`获取远程文件失败: ${err.message}`));
      });

      // 结束请求
      fileRequest.end();
    });
  }
}
