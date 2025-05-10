// 订阅模板
import { BaseHttp } from './base.http';
import { SendSubscribeMessageOptions, TemplateMessageOptions } from './type';
import util from 'util';

/**
 * 从公共模板库中选用模板，到私有模板库中
 * @param {string} accessToken 授权access_token
 * @param {string} tid 模板标题 id，可通过getPubTemplateTitleList接口获取，也可登录公众号后台查看获取
 * @param {string} kidList 开发者自行组合好的模板关键词列表，关键词顺序可以自由搭配（例如 [3,5,4] 或 [4,5,3]），最多支持5个，最少2个关键词组合
 * @param {string} sceneDesc 服务场景描述，15个字以内
 * @returns {Promise<T>} 返回结果
 */
export async function addTemplate<T>(accessToken: string, tid: string, kidList: string[], sceneDesc: string): Promise<T> {
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
 * @returns {Promise<T>} 返回结果
 */
export async function delTemplate<T>(accessToken: string, priTmplId: string): Promise<T> {
  const url = util.format('/wxaapi/newtmpl/deltemplate?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    priTmplId,
  });
}

/**
 * 获取公众号类目
 * @param {string} accessToken 授权access_token
 * @returns {Promise<T>} 返回结果
 */
export async function getCategory<T>(accessToken: string): Promise<T> {
  const url = util.format('/wxaapi/newtmpl/getcategory?access_token=%s', accessToken);
  return await BaseHttp.get(url);
}

/**
 * 获取公共模板标题下的关键词列表
 * @param {string} accessToken 授权access_token
 * @param {string} tid 模板标题 id
 * @returns {Promise<T>} 返回结果
 */
export async function getPubTemplateKeyWords<T>(accessToken: string, tid: string): Promise<T> {
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
 * @returns {Promise<T>} 返回结果
 */
export async function getPubTemplateTitles<T>(accessToken: string, ids: string, start: number, limit: number): Promise<T> {
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
 * @returns {Promise<T>} 返回结果
 */
export async function getPrivatelyTemplateList<T>(accessToken: string): Promise<T> {
  const url = util.format('/wxaapi/newtmpl/gettemplate?access_token=%s', accessToken);
  return await BaseHttp.get(url);
}

/**
 * 发送订阅通知
 * @param {string} accessToken 授权access_token
 * @param {SendSubscribeMessageOptions} options 发送订阅通知的参数
 * @returns {Promise<T>} 返回结果
 */
export async function sendSubscribeMessage<T>(accessToken: string, options: SendSubscribeMessageOptions): Promise<T> {
  const url = util.format('/cgi-bin/message/subscribe/bizsend?access_token=%s', accessToken);
  return await BaseHttp.post(url, options);
}

/**
 * 查询拦截的模板消息
 * @param {string} accessToken 授权access_token
 * @param {string} tmpl_msg_id 被拦截的模板消息id
 * @param {number} largest_id 上一页查询结果最大的id，用于翻页，第一次传0
 * @param {number} limit 单页查询的大小，最大100
 * @returns {Promise<T>} 返回结果
 */
export async function getInterceptedTemplateMessage<T>(accessToken: string, tmpl_msg_id: string, largest_id: number, limit: number): Promise<T> {
  const url = util.format('/wxa/sec/queryblocktmplmsg?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    tmpl_msg_id,
    largest_id,
    limit,
  });
}

// 模板消息

/**
 * 设置所属行业
 * @param {string} accessToken 授权access_token
 * @param {string} industryId1 公众号模板消息所属行业编号
 * @param {string} industryId2 公众号模板消息所属行业编号
 * @returns {Promise<T>} 返回结果
 */
export async function setIndustry<T>(accessToken: string, industryId1: string, industryId2: string): Promise<T> {
  const url = util.format('/cgi-bin/template/api_set_industry?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    industry_id1: industryId1,
    industry_id2: industryId2,
  });
}

/**
 * 获取设置的行业信息
 * @param {string} accessToken 授权access_token
 * @returns {Promise<T>} 返回结果
 */
export async function getIndustry<T>(accessToken: string): Promise<T> {
  const url = util.format('/cgi-bin/template/get_industry?access_token=%s', accessToken);
  return await BaseHttp.get(url);
}
/**
 * 获得模板ID
 * @param {string} accessToken 授权access_token
 * @param {string} template_id_short 模板库中模板的编号，有“TM**”和“OPENTMTM**”等形式,对于类目模板，为纯数字ID
 * @param {string} keyword_name_list 选用的类目模板的关键词,按顺序传入,如果为空，或者关键词不在模板库中，会返回40246错误码
 * @returns {Promise<T>} 返回结果
 */
export async function getTemplateId<T>(accessToken: string, template_id_short: string, keyword_name_list: string[]): Promise<T> {
  const url = util.format('/cgi-bin/template/api_add_template?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    template_id_short,
    keyword_name_list,
  });
}

/**
 * 获取模板列表
 * @param {string} accessToken 授权access_token
 * @returns {Promise<T>} 返回结果
 */
export async function getTemplateList<T>(accessToken: string): Promise<T> {
  const url = util.format('/cgi-bin/template/get_all_private_template?access_token=%s', accessToken);
  return await BaseHttp.get(url);
}

/**
 * 删除模板（模板消息）
 * @param {string} accessToken 授权access_token
 * @param {string} templateId 模板ID
 * @returns {Promise<T>} 返回结果
 */
export async function deleteTemplate<T>(accessToken: string, templateId: string): Promise<T> {
  const url = util.format('/cgi-bin/template/del_private_template?access_token=%s', accessToken);
  return await BaseHttp.post(url, {
    template_id: templateId,
  });
}

/**
 * 发送模板消息
 * @param {string} accessToken 授权access_token
 * @param {TemplateMessageOptions} options 发送模板消息的参数
 * @returns {Promise<T>} 返回结果
 */
export async function sendTemplateMessage<T>(accessToken: string, options: TemplateMessageOptions): Promise<T> {
  const url = util.format('/cgi-bin/message/template/send?access_token=%s', accessToken);
  return await BaseHttp.post(url, options);
}
