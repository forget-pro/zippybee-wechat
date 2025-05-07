import { Http } from '../http';
import crypto from 'crypto';
import { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import { isAbsolute } from 'path';
import { PayConfig, SignParams, UnifiedOrderParams, RefundParams, ExceptionRefundParams, CombineUnifiedOrderParams, CloseCombineOrderParams, RefundCombineOrderParams, DecryptCallbackSignParams } from './type';
import util from 'util';

export class WxPay {
  public config: PayConfig;
  public readonly http: Http;
  private keyContent: string = '';
  private publicKeyContent: string = '';
  private baseurl: string = 'https://api.mch.weixin.qq.com';
  constructor(config: PayConfig) {
    this.config = config;
    this.http = new Http(this.baseurl, (config) => {
      const params = config.params || config.data;
      config.headers['Authorization'] = this.createAuthorizationHeader(config.url || '', config.method?.toLocaleUpperCase(), params);
      return config;
    });
  }

  // 获取ApiKey的内容
  private getApiKeyContent(): string {
    if (this.keyContent) return this.keyContent;
    // 判断config.apiClientkey是否为文件路径
    if (isAbsolute(this.config.apiClientkey)) {
      this.keyContent = fs.readFileSync(this.config.apiClientkey, 'utf-8');
    } else {
      this.keyContent = this.config.apiClientkey;
    }
    return this.keyContent;
  }

  // 获取公钥的内容
  private getPublicKeyContent(): string {
    if (this.publicKeyContent) return this.publicKeyContent;
    if (isAbsolute(this.config.publicKey)) {
      this.publicKeyContent = fs.readFileSync(this.config.publicKey, 'utf-8');
    } else {
      this.publicKeyContent = this.config.publicKey;
    }
    return this.publicKeyContent;
  }

  //   构建签名字符串
  private buildSignString(params: SignParams) {
    const valuesArr = [params.methods, params.url, params.timestamp, params.nonce_str];
    if (params.params) {
      valuesArr.push(JSON.stringify(params.params));
    }
    const sortValuesgin = valuesArr.join('\n');
    return params.params ? sortValuesgin + '\n' : sortValuesgin + '\n\n';
  }

  //   生成请求签名
  private createAuthorizationHeader(url: string, methods: AxiosRequestConfig['method'], data: Record<string, any>) {
    const timestamp = Math.ceil(Date.now() / 1000);
    const nonce_str = Math.random().toString(36).substring(2, 12);
    const signString = this.buildSignString({
      methods: methods,
      url: url,
      timestamp,
      nonce_str,
      params: data,
    });
    const sign = crypto.createSign('RSA-SHA256').update(signString).sign(this.getApiKeyContent(), 'base64');
    return `WECHATPAY2-SHA256-RSA2048 mchid="${this.config.mch_id}",nonce_str="${nonce_str}",serial_no="${this.config.serial_no}",timestamp="${timestamp}",signature="${sign}"`;
  }

  // 小程序prepay_id 签名
  public signPrepayId(prepay_id: string) {
    const timestamp = Math.ceil(Date.now() / 1000);
    const nonce_str = Math.random().toString(36).substring(2, 12);
    const packageStr = `prepay_id=${prepay_id}`;
    const sginStr = [this.config.appid, timestamp, nonce_str, packageStr].join('\n') + '\n';
    const paySign = crypto.createSign('RSA-SHA256').update(sginStr).sign(this.getApiKeyContent(), 'base64');
    return {
      timestamp,
      nonce_str,
      paySign,
      package: packageStr,
    };
  }
  /**
   * 小程序公众号统一下单
   * @param options 统一下单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012791856
   * @returns
   */
  public async unifiedOrder<T>(options: UnifiedOrderParams): Promise<T> {
    const params = {
      appid: this.config.appid,
      mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/pay/transactions/jsapi', params);
    if (res.prepay_id) {
      return { ...this.signPrepayId(res.prepay_id), prepay_id: res.prepay_id, partnerId: this.config.mch_id } as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * App 统一下单
   * @param options 统一下单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012791856
   * @returns
   */
  public async unifiedOrderApp<T>(options: UnifiedOrderParams): Promise<T> {
    const params = {
      appid: this.config.appid,
      mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/pay/transactions/app', params);
    if (res.prepay_id) {
      const { package: packageStr, ...params } = this.signPrepayId(res.prepay_id);
      return { ...params, prepay_id: res.prepay_id, partnerId: this.config.mch_id } as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * H5 统一下单
   * @param options 统一下单参数  https://pay.weixin.qq.com/doc/v3/merchant/4012791834
   */
  public async unifiedOrderH5<T>(options: UnifiedOrderParams): Promise<T> {
    const params = {
      appid: this.config.appid,
      mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/pay/transactions/h5', params);
    if (res.h5_url) {
      return res.h5_url as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * Native 支付 统一下单
   * @param options 统一下单参数  https://pay.weixin.qq.com/doc/v3/merchant/4012791877
   */
  public async unifiedOrderNative<T>(options: UnifiedOrderParams): Promise<T> {
    const params = {
      appid: this.config.appid,
      mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/pay/transactions/native', params);
    if (res.code_url) {
      return res.code_url as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * 微信支付订单号查询订单
   * @param transaction_id  微信支付订单号
   * @returns
   */
  public async queryOrder<T>(transaction_id: string): Promise<T> {
    const url = util.format('/v3/pay/transactions/id/%s', transaction_id);
    return await this.http.get(url, { mchid: this.config.mch_id });
  }
  /**
   * 商户订单号查询订单
   * @param out_trade_no 商户订单号
   * @returns
   */
  public async queryOrderByOutTradeNo<T>(out_trade_no: string): Promise<T> {
    const url = util.format('/v3/pay/transactions/out-trade-no/%s', out_trade_no);
    return await this.http.get(url, { mchid: this.config.mch_id });
  }

  /**
   * 关闭订单
   * @param out_trade_no 商户订单号
   * @returns
   */
  public async closeOrder<T>(out_trade_no: string): Promise<T> {
    const url = util.format('/v3/pay/transactions/out-trade-no/%s/close', out_trade_no);
    return await this.http.post(url, { mchid: this.config.mch_id });
  }

  /**
   * 退款申请
   * @param options  退款参数详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012791862
   * @returns
   */
  public async refund<T>(options: RefundParams): Promise<T> {
    const url = util.format('/v3/refund/domestic/refunds');
    return await this.http.post(url, options);
  }

  /**
   * 查询单笔退款（通过商户退款单号）
   * @param out_refund_no 商户退款单号
   * @returns
   */
  public async queryRefund<T>(out_refund_no: string): Promise<T> {
    const url = util.format('/v3/refund/domestic/refunds/%s', out_refund_no);
    return await this.http.get(url, { mchid: this.config.mch_id });
  }

  /**
   * 发起异常退款
   * @param options 异常退款参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012791862
   * @returns
   */
  public async exceptionRefund<T>(options: ExceptionRefundParams): Promise<T> {
    const { refund_id, ...params } = options;
    const url = util.format('/v3/refund/domestic/refunds/%s/apply-abnormal-refund', refund_id);
    return await this.http.post(url, params);
  }

  /**
   * 申请交易账单
   * @param bill_date 【账单日期】 账单日期，格式yyyy-MM-DD，仅支持三个月内的账单下载申请。
   * @param bill_type 账单类型 'ALL' | 'SUCCESS' | 'REFUND'
   * @param tar_type 压缩类型 'gzip'
   * @returns
   */
  public async applyTradeBill<T>(bill_date: string, bill_type: 'ALL' | 'SUCCESS' | 'REFUND', tar_type: string = 'GZIP'): Promise<T> {
    return await this.http.get('/v3/bill/tradebill', { bill_date, bill_type, tar_type });
  }

  /**
   * 申请资金账单
   * @param bill_date 【账单日期】 账单日期，格式yyyy-MM-DD，仅支持三个月内的账单下载申请。
   * @param bill_type 账单类型 'ALL' | 'SUCCESS' | 'REFUND'
   * @param tar_type 压缩类型 'gzip'
   * @returns
   */
  public async applyFundBill<T>(bill_date: string, bill_type: 'ALL' | 'SUCCESS' | 'REFUND', tar_type: string = 'GZIP'): Promise<T> {
    return await this.http.get('/v3/bill/fundflowbill', { bill_date, bill_type, tar_type });
  }

  /**
   * 下载账单
   * @param url 账单下载地址 通过申请交易账单或申请资金账号api获取 示例： https://api.mch.weixin.qq.com/v3/billdownload/file?token=xxx
   * @returns
   */
  public async downloadBill<T>(url: string): Promise<T> {
    const req_url = url.replace(this.baseurl, '');
    return await this.http.get(req_url);
  }

  /**
   * 解密敏感数据
   * @param nonce 随机字符串
   * @param associatedData 附加数据
   * @param ciphertext 密文
   * @returns
   */
  public decryptData(nonce: string, associatedData: string, ciphertext: string): string {
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
    const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
    const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);
    const decipherIv = crypto.createDecipheriv('aes-256-gcm', Buffer.from(this.config.apiV3key || ''), nonce);
    decipherIv.setAuthTag(Buffer.from(authTag));
    decipherIv.setAAD(Buffer.from(associatedData));
    const decryptStr = decipherIv.update(data, undefined, 'utf8');
    decipherIv.final();
    return decryptStr;
  }

  // 下载平台证书
  public async downloadPlatformCert<T>(): Promise<T> {
    const url = util.format('/v3/certificates');
    const result = await this.http.get(url);
    if (result.data.length) {
      return result.data.map((item: any) => {
        return {
          ...item,
          cert: this.decryptData(item.encrypt_certificate.nonce, item.encrypt_certificate.associated_data, item.encrypt_certificate.ciphertext),
        };
      }) as unknown as T;
    } else {
      return result;
    }
  }

  /**
   * 微信支付v3 响应回调签名验证
   * @param options
   * @param options.timestamp 时间戳 微信header wechatpay-timestamp
   * @param options.nonce 随机字符串 微信header wechatpay-nonce
   * @param options.signature 签名 微信header wechatpay-signature
   * @param options.body 回调体
   * @returns
   */
  public async decryptCallbackSign<T>(options: DecryptCallbackSignParams): Promise<T> {
    const { timestamp, nonce, signature, body } = options;
    const signStr = [timestamp, nonce, signature, typeof body == 'string' ? body : JSON.stringify(body)].join('\n') + '\n';
    return crypto.createVerify('RSA-SHA256').update(signStr).verify(this.getPublicKeyContent(), signature, 'base64') as unknown as T;
  }

  /**
   * App合单下单
   * @param options 合单下单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012556944
   * @param options.combine_appid 默认采用实例化的appid 如果需要指定其他appid 可以传入
   * @param options.combine_mchid 默认采用实例化的mch_id 如果需要指定其他mch_id 可以传入
   * @returns
   */
  public async unifiedOrderAppCombine<T>(options: CombineUnifiedOrderParams): Promise<T> {
    const params = {
      combine_appid: this.config.appid,
      combine_mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/combine-transactions/app', params);
    if (res.prepay_id) {
      return { ...this.signPrepayId(res.prepay_id), prepay_id: res.prepay_id, partnerId: this.config.mch_id } as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * H5 合单支付
   * @param options 合单下单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012556961
   * @param options.combine_appid 默认采用实例化的appid 如果需要指定其他appid 可以传入
   * @param options.combine_mchid 默认采用实例化的mch_id 如果需要指定其他mch_id 可以传入
   * @returns
   */
  public async unifiedOrderH5Combine<T>(options: CombineUnifiedOrderParams): Promise<T> {
    const params = {
      combine_appid: this.config.appid,
      combine_mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/combine-transactions/h5', params);
    if (res.h5_url) {
      return res.h5_url as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * JSAPI AND 小程序合单支付
   * @param options 合单下单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012556926
   * @param options.combine_appid 默认采用实例化的appid 如果需要指定其他appid 可以传入
   * @param options.combine_mchid 默认采用实例化的mch_id 如果需要指定其他mch_id 可以传入
   * @returns
   */
  public async unifiedOrderJsapiCombine<T>(options: CombineUnifiedOrderParams): Promise<T> {
    const params = {
      combine_appid: this.config.appid,
      combine_mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/combine-transactions/jsapi', params);
    if (res.prepay_id) {
      return { ...this.signPrepayId(res.prepay_id), prepay_id: res.prepay_id, partnerId: this.config.mch_id } as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * Native 合单支付
   * @param options 合单下单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012556933
   * @param options.combine_appid 默认采用实例化的appid 如果需要指定其他appid 可以传入
   * @param options.combine_mchid 默认采用实例化的mch_id 如果需要指定其他mch_id 可以传入
   * @returns
   */
  public async unifiedOrderNativeCombine<T>(options: CombineUnifiedOrderParams): Promise<T> {
    const params = {
      combine_appid: this.config.appid,
      combine_mchid: this.config.mch_id,
      ...options,
    };
    const res = await this.http.post('/v3/combine-transactions/native', params);
    if (res.code_url) {
      return res.code_url as unknown as T;
    } else {
      return Promise.reject(res);
    }
  }

  /**
   * 查询合单订单
   * @param combine_out_trade_no 合单商户订单号
   * @returns
   */
  public async queryCombineOrder<T>(combine_out_trade_no: string): Promise<T> {
    const url = util.format('/v3/combine-transactions/out-trade-no/%s', combine_out_trade_no);
    return await this.http.get(url);
  }

  /**
   * 关闭合单订单
   * @param options  关闭合单订单参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012577452
   * @param options.combine_appid 默认采用实例化的appid 如果需要指定其他appid 可以传入
   * @returns
   */
  public async closeCombineOrder<T>(options: CloseCombineOrderParams): Promise<T> {
    const { combine_out_trade_no, ...params } = options;
    const url = util.format('/v3/combine-transactions/out-trade-no/%s/close', combine_out_trade_no);
    return await this.http.post(url, { combine_appid: this.config.appid, ...params });
  }

  /**
   * 退款申请(合单)
   * @param options 退款申请参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4012577452
   * @returns
   */
  public async refundCombineOrder<T>(options: RefundCombineOrderParams): Promise<T> {
    return await this.http.post('/v3/refund/domestic/refunds', options);
  }

  /**
   * 查询单笔退款(合单)
   * @param out_refund_no 【商户退款单号】 商户申请退款时传入的商户系统内部退款单号。
   * @returns
   */
  public async queryCombineRefund<T>(out_refund_no: string): Promise<T> {
    return await this.http.get(util.format('/v3/refund/domestic/refunds/%s', out_refund_no));
  }

  /**
   * 发起异常退款(合单)
   * @param options 异常退款参数 详见文档 https://pay.weixin.qq.com/doc/v3/merchant/4013420988
   * @returns
   */
  public async exceptionCombineRefund<T>(options: ExceptionRefundParams): Promise<T> {
    const { refund_id, ...params } = options;
    const url = util.format('/v3/refund/domestic/refunds/%s/apply-abnormal-refund', refund_id);
    return await this.http.post(url, params);
  }
}
