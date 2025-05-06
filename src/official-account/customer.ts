import { BaseHttp } from './base.http';
import { CustomerServiceAccount, MessageContent } from './type';
import util from 'util';
// 客服模块
/**
 * 添加客服账号
 * @param kf_account 公众号的access_token
 * @param params 客服参数
 * @returns
 */
export const addCustomerServiceAccount = async (access_token: string, params: CustomerServiceAccount) => {
  const url = util.format('/customservice/kfaccount/add/access_token=%s', access_token);
  const response = await BaseHttp.post(url, params);
  return response;
};

/**
 * 客服发送消息
 * @param access_token 公众号的access_token
 * @param openid 用户的openid
 * @param content 消息内容
 * @returns
 */
export const sendConcatMessage = async (access_token: string, messageContent: MessageContent) => {
  const url = util.format('message/custom/send/%s', access_token);
  const response = await BaseHttp.post(url, messageContent);
  return response;
};
/**
 * 修改客服账号
 * @param access_token 公众号的access_token
 * @param params 客服参数
 * @returns
 */
export const updateCustomerServiceAccount = async (access_token: string, params: CustomerServiceAccount) => {
  const url = util.format('/customservice/kfaccount/update?access_token=%s', access_token);
  return await BaseHttp.post(url, params);
};
/**
 * 删除客服账号
 * @param access_token 公众号的access_token
 * @param kf_account 客服账号
 * @returns
 */
export const deleteCustomerServiceAccount = async (access_token: string, kf_account: string) => {
  const url = util.format('/customservice/kfaccount/del?access_token=%s', access_token);
  return await BaseHttp.post(url, { kf_account });
};

/**
 * 获取客服账号列表
 * @param access_token 公众号的access_token
 * @returns
 */
export const getCustomerServiceAccountList = async (access_token: string) => {
  const url = util.format('/cgi-bin/customservice/getkflist?access_token=%s', access_token);
  return await BaseHttp.get(url);
};

/**
 * 设置客服账号的头像
 * @param access_token 公众号的access_token
 * @param kf_account 客服账号
 * @param headimgurl 头像url
 * @returns
 */
export const setCustomerServiceAccountHeadimg = async (access_token: string, kf_account: string, headimgurl: string) => {
  const url = util.format('/cgi-bin/customservice/kfaccount/uploadheadimg?access_token=%s', access_token);
  return await BaseHttp.post(url, {
    kf_account,
    headimgurl,
  });
};

/**
 * 获取所有客服账号
 * @param access_token 公众号的access_token
 * @returns
 */
export const getAllCustomerServiceAccount = async (access_token: string) => {
  const url = util.format('/cgi-bin/customservice/getkflist?access_token=%s', access_token);
  return await BaseHttp.get(url);
};
