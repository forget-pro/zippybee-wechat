// 消息模板
import { BaseHttp } from './base.http';
import { SendSubscribeMessageOptions } from './type';
import util from 'util';

/**
 * 从公共模板库中选用模板，到私有模板库中
 * @param {string} accessToken 授权access_token
 * @param {string} tid 模板标题 id，可通过getPubTemplateTitleList接口获取，也可登录公众号后台查看获取
 * @param {string} kidList 开发者自行组合好的模板关键词列表，关键词顺序可以自由搭配（例如 [3,5,4] 或 [4,5,3]），最多支持5个，最少2个关键词组合
 * @param {string} sceneDesc 服务场景描述，15个字以内
 * @returns {Promise<any>} 返回结果
 */
export async function addTemplate(accessToken: string, tid: string, kidList: string[], sceneDesc: string): Promise<any> {
  const url = util.format('/wxaapi/newtmpl/addtemplate?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    tid,
    kidList,
    sceneDesc,
  });
}

/**
 * 删除模板
 * @param {string} accessToken 授权access_token
 * @param {string} priTmplId 模板ID
 * @returns {Promise<any>} 返回结果
 */
export async function delTemplate(accessToken: string, priTmplId: string): Promise<any> {
  const url = util.format('/wxaapi/newtmpl/deltemplate?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    priTmplId,
  });
}

/**
 * 获取公众号类目
 * @param {string} accessToken 授权access_token
 * @returns {Promise<any>} 返回结果
 */

export async function getCategory(accessToken: string): Promise<any> {
  const url = util.format('/wxaapi/newtmpl/getcategory?access_token=%s', accessToken);
  return await BaseHttp.get(url);
}

/**
 * 获取公共模板标题下的关键词列表
 * @param {string} accessToken 授权access_token
 * @param {string} tid 模板标题 id
 * @returns {Promise<any>} 返回结果
 */

export async function getPubTemplateKeyWords(accessToken: string, tid: string): Promise<any> {
  const url = util.format('/wxaapi/newtmpl/getpubtemplatekeywords?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    tid,
  });
}

/**
 * 获取类目下的公共模板
 * @param {string} accessToken 授权access_token
 * @param {string} ids 类目 id
 * @param {string} start 开始位置
 * @param {number} limit 返回数量，最大值为 30
 */
export async function getPubTemplateTitles(accessToken: string, ids: string, start: number, limit: number): Promise<any> {
  const url = util.format('/wxaapi/newtmpl/getpubtemplatetitles?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    ids,
    start,
    limit,
  });
}

/**
 * 获取私有模板列表
 * @param {string} accessToken 授权access_token
 * @returns {Promise<any>} 返回结果
 */
export async function getTemplateList(accessToken: string): Promise<any> {
  const url = util.format('/wxaapi/newtmpl/gettemplate?access_token=%s', accessToken);
  return await BaseHttp.get(url);
}

/**
 * 发送订阅通知
 * @param {string} accessToken 授权access_token
 * @param {SendSubscribeMessageOptions} options 发送订阅通知的参数
 * @returns {Promise<any>} 返回结果
 */
export async function sendSubscribeMessage(accessToken: string, options: SendSubscribeMessageOptions): Promise<any> {
  const url = util.format('/cgi-bin/message/subscribe/bizsend?access_token=%s', accessToken);
  return await BaseHttp.post(url, options);
}

/**
 * 查询拦截的模板消息
 * @param {string} accessToken 授权access_token
 * @param {string} tmpl_msg_id 被拦截的模板消息id
 * @param {number} largest_id 上一页查询结果最大的id，用于翻页，第一次传0
 * @param {number} limit 单页查询的大小，最大100
 * @returns {Promise<any>} 返回结果
 */

export async function getInterceptedTemplateMessage<T>(accessToken: string, tmpl_msg_id: string, largest_id: number, limit: number): Promise<T> {
  const url = util.format('/wxa/sec/queryblocktmplmsg?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    tmpl_msg_id,
    largest_id,
    limit,
  });
}
