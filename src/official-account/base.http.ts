import { Http } from '../http';
import { MaterialUploadOptions } from './type';
export class BaseHttp {
  private static httpInstance: BaseHttp | null = null;
  private httpClient: Http;
  private headers: Record<string, string> = {};

  constructor(private baseUrl: string = 'https://api.weixin.qq.com') {
    this.httpClient = new Http(this.baseUrl);
  }

  /**
   * 获取单例实例，无需new操作符
   */
  public static getInstance(): BaseHttp {
    if (!BaseHttp.httpInstance) {
      BaseHttp.httpInstance = new BaseHttp();
    }
    return BaseHttp.httpInstance;
  }

  /**
   * 静态GET请求方法（无需new）
   */
  public static async get(url: string, params?: any) {
    return BaseHttp.getInstance().get(url, params);
  }

  /**
   * 静态POST请求方法（无需new）
   */
  public static async post(url: string, data?: any) {
    return BaseHttp.getInstance().post(url, data);
  }

  /**
   * 静态上传文件方法（无需new）
   */
  public static async uploadMedia(url: string, { media, filename, description, fieldName }: Omit<MaterialUploadOptions, 'access_token' | 'isPermanent' | 'type' | 'headers'>) {
    return BaseHttp.getInstance().uploadMedia(url, { media, filename, description, fieldName });
  }

  /**
   * GET请求方法
   */
  public async get(url: string, params?: any) {
    return this.httpClient.get(url, params);
  }

  /**
   * POST请求方法
   */
  public async post(url: string, data?: any) {
    return this.httpClient.post(url, data);
  }

  /**
   * 上传文件方法
   */
  public async uploadMedia(url: string, { media, filename, description, fieldName }: Omit<MaterialUploadOptions, 'access_token' | 'headers' | 'type' | 'isPermanent'>) {
    return this.httpClient.postFormData(url, {
      media,
      filename,
      description,
      fieldName,
    });
  }

  /**
   * 上传URL文件
   */
  public async uploadMediaFromUrl(url: string, fileUrl: string, options: Omit<MaterialUploadOptions, 'access_token' | 'media' | 'type' | 'isPermanent'> = {}) {
    // 合并headers
    const mergedHeaders = { ...this.headers, ...options.headers };
    return this.httpClient.postFormDataFromUrl(url, fileUrl, {
      fieldName: options.fieldName,
      headers: mergedHeaders,
      description: options.description || '',
      filename: options.filename || '',
    });
  }

  /**
   * 设置请求头
   * 由于Http类没有提供设置headers的方法，我们在BaseHttp类中保存headers，
   * 并在调用请求方法时传递这些headers
   */
  public setHeaders(headers: Record<string, string>) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
    return this;
  }
}
