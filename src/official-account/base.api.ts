// 基础api
import { BaseHttp } from './base.http';
import util from 'util';
import crypto from 'crypto';
import { QrcodeOptions } from './type';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

/**
 * 获取access_token
 * @returns
 */
export const getAccessToken = async (appid: string, secret: string) => {
  const response = await BaseHttp.get('/cgi-bin/token/', {
    appid,
    secret,
    grant_type: 'client_credential',
  });
  return {
    access_token: response.access_token,
    expires_in: response.expires_in,
  };
};

/**
 * 查询api Quota
 * @param access_token 公众号的access_token
 * @param cgi_path 接口路径
 * @returns
 */
export const getQuota = async (access_token: string, cgi_path: string) => {
  const url = util.format('/cgi-bin/get_quota/access_token=%s', access_token);
  const response = await BaseHttp.post(url, {
    cgi_path,
  });
  return response;
};

/**
 * 查询rid信息
 * @param access_token 公众号的access_token
 * @param rid 消息id
 * @returns
 */
export const getRid = async (access_token: string, rid: string) => {
  const url = util.format('/cgi-bin/openapi/rid/get?access_token=%s', access_token);
  const response = await BaseHttp.post(url, {
    rid,
  });
  return response;
};

/**
 * 清空api Quota
 * @param access_token 公众号的access_token
 * @returns
 */
export const clearQuota = async (appid: string, access_token: string) => {
  const url = util.format('/cgi-bin/clear_quota?access_token=%s', access_token);
  const response = await BaseHttp.post(url, {
    appid,
  });
  return response;
};

/**
 * 使用AppSecret重置api调用次数
 * @param access_token 公众号的access_token
 * @returns
 */
export const resetQuota = async (appid: string, appSecret: string) => {
  const response = await BaseHttp.post('/cgi-bin/clear_quota/v2', {
    appsecret: appSecret,
    appid: appid,
  });
  return response;
};

/**
 * 获取公众号设置的jsapi_ticket
 * @param access_token 公众号的access_token
 * @returns
 */
export const getJsapiTicket = async (access_token: string) => {
  const url = util.format('/cgi-bin/ticket/getticket?access_token=%s&type=jsapi', access_token);
  return await BaseHttp.get(url);
};

/**
 * jsapi_ticket 签名
 * @param jsapi_ticket jsapi_ticket
 * @param url 当前网页的URL，不包含#及其后面部分
 * @returns
 */
export const getJsapiTicketSignature = async (jsapi_ticket: string, url: string) => {
  const timestamp = Math.floor(new Date().getTime() / 1000) + '';
  const nonce = Math.random().toString(36).substring(2, 15);
  const str = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonce}&timestamp=${timestamp}&url=${url}`;
  const sign = crypto.createHash('sha1').update(str).digest('hex');
  return {
    timestamp,
    nonce,
    sign,
  };
};

/**
 * 公众号网页access_token
 * @param appid 公众号的appid
 * @param secret 公众号的secret
 * @returns
 */
export const getWebAccessToken = async (appid: string, secret: string) => {
  const url = util.format('/sns/oauth2/access_token?grant_type=client_credential&appid=%s&secret=%s', appid, secret);
  return await BaseHttp.get(url);
};

/**
 * 获取公众号用户信息
 * @param access_token 公众号的access_token
 * @param openid 用户的openid
 * @returns
 */
export const getUserInfo = async (access_token: string, openid: string) => {
  const url = util.format('/sns/userinfo?access_token=%s&openid=%s', access_token, openid);
  return await BaseHttp.get(url);
};

/**
 * 公众号消息来源验证
 * 用户发送消息给公众号时，微信服务器会将消息加密，并发送给公众号
 * @param token 公众号后台填写的token
 * @param timestamp 时间戳
 * @param nonce 随机数
 * @param encrypt 微信加密字符串 xml 中 Encrypt 字段
 * @returns
 */
export const verifyMessage = async (token: string, timestamp: string, nonce: string, encrypt?: string) => {
  const signParams = [token, timestamp, nonce];
  if (encrypt) {
    signParams.push(encrypt);
  }
  const str = signParams.sort().join('');
  return crypto.createHash('sha1').update(str).digest('hex');
};

/**
 * 公众号消息解密
 * 用户发送消息给公众号时，微信服务器会将消息加密，并发送给公众号
 * @param aesKey 公众后台填写的aesKey
 * @param token 公众号后台填写的token
 * @param encrypt 微信加密字符串 xml 中 Encrypt 字段
 * @returns
 */
export const decryptMessage = async (aesKey: string, token: string, encrypt: string) => {
  const aes_key = Buffer.from(aesKey + '=', 'base64');
  const aes_iv_key = aes_key.subarray(0, 16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', aes_key, aes_iv_key).setAutoPadding(false);
  const xml_text = decipher.update(encrypt, 'base64', 'utf8') + decipher.final('utf8');
  const xml = xml_text.substring(20, xml_text.lastIndexOf('>') + 1);
  const parser = new XMLParser();
  return parser.parse(xml);
};

/**
 * 公众号消息加密
 * 公众号发送消息给用户时，微信服务器会将消息加密，并发送给公众号
 * @param appid 公众号appid
 * @param token 公众号后台填写的token
 * @param aesKey 公众后台填写的aesKey
 * @param xml 需要加密的xml
 */
export const encryptMessage = async (appid: string, token: string, aesKey: string, xml: string) => {
  const aes_key = Buffer.from(aesKey + '=', 'base64');

  const aes_iv_key = aes_key.subarray(0, 16);

  // 16B 随机字符串
  const randomString = crypto.randomBytes(16);

  const msg = Buffer.from(xml);
  // 获取4B的内容长度的网络字节序
  const msgLength = Buffer.alloc(4);

  msgLength.writeUInt32BE(msg.length, 0);

  const id = Buffer.from(appid);

  const bufMsg = Buffer.concat([randomString, msgLength, msg, id]);

  // 对明文进行补位操作
  const encoded = PKCS7Encode(bufMsg);

  // 创建加密对象，AES采用CBC模式，数据采用PKCS#7填充；IV初始向量大小为16字节，取AESKey前16字节
  const cipher = crypto.createCipheriv('aes-256-cbc', aes_key, aes_iv_key);
  cipher.setAutoPadding(false);

  const cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);

  const signature = cipheredMsg.toString('base64');

  //  9位随机数字
  const nonce = Math.floor(Math.random() * 1000000000);

  const timestamp = Math.ceil(Date.now() / 1000);

  const msg_signature = verifyMessage(token, timestamp.toString(), nonce.toString(), signature);

  const builder = new XMLBuilder({ format: true });

  return builder.build({
    Encrypt: signature,
    MsgSignature: msg_signature,
    TimeStamp: timestamp.toString(),
    Nonce: nonce.toString(),
  });
};

//   字符补位
export const PKCS7Encode = (text: Buffer) => {
  const blockSize = 32;
  const textLength = text.length;
  // 计算需要填充的位数
  const amountToPad = blockSize - (textLength % blockSize);
  const result = Buffer.alloc(amountToPad);
  result.fill(amountToPad);
  return Buffer.concat([text, result]);
};

/**
 * 对象转xml
 * @param obj 对象
 * @returns
 */
export const objectToXml = (obj: any) => {
  const builder = new XMLBuilder({ format: true });
  return builder.build(obj);
};

/**
 * xml转对象
 * @param xml xml
 * @returns
 */
export const xmlToObject = (xml: string) => {
  const parser = new XMLParser();
  return parser.parse(xml);
};

/**
 * 生成带参数的二维码
 * @param access_token 公众号的access_token
 * @param {QrcodeOptions} options 参数
 * @returns
 */

export const getQrcode = async (access_token: string, options: QrcodeOptions) => {
  const url = util.format('/cgi-bin/qrcode/create?access_token=%s', access_token);
  return await BaseHttp.post(url, options);
};

/**
 * 短key托管
 * @param access_token 公众号的access_token
 * @param long_data 需要转换的长信息，不超过4KB
 * @param {number} expire_seconds 过期秒数，最大值为2592000（即30天），默认为2592000
 * @returns
 */
export const shortKey = async (access_token: string, long_data: string, expire_seconds?: number) => {
  const url = util.format('/cgi-bin/shorten/gen?access_token=%s', access_token);
  return await BaseHttp.post(url, {
    long_data,
    expire_seconds,
  });
};
