// 用户模块
import { BaseHttp } from './base.http';
/**
 * 创建标签
 * @param {string} accessToken - 授权access_token
 * @param {string} tagName - 标签名称
 * @returns {Promise<any>} - 返回创建的标签信息
 */

export const createUserTag = async <T>(accessToken: string, tagName: string): Promise<T> => {
  const url = `/cgi-bin/tags/create?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    tag: {
      name: tagName,
    },
  });
  return response;
};

/**
 * 获取公众号已创建的标签
 * @param {string} accessToken - 授权access_token
 * @returns {Promise<any>} - 返回已创建的标签列表
 */
export const getUserTags = async <T>(accessToken: string): Promise<T> => {
  const url = `/cgi-bin/tags/get?access_token=${accessToken}`;
  const response = await BaseHttp.get(url);
  return response;
};

/**
 * 编辑标签
 * @param {string} accessToken - 授权access_token
 * @param {number} tagId - 标签ID
 * @param {string} tagName - 新的标签名称
 * @returns {Promise<any>} - 返回编辑后的标签信息
 */
export const updateUserTag = async <T>(accessToken: string, tagId: number, tagName: string): Promise<T> => {
  const url = `/cgi-bin/tags/update?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    tag: {
      id: tagId,
      name: tagName,
    },
  });
  return response;
};

/**
 * 删除标签
 * @param {string} accessToken - 授权access_token
 * @param {number} tagId - 标签ID
 * @returns {Promise<any>} - 返回删除结果
 */
export const deleteUserTag = async <T>(accessToken: string, tagId: number): Promise<T> => {
  const url = `/cgi-bin/tags/delete?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    tag: {
      id: tagId,
    },
  });
  return response;
};

/**
 * 获取标签下粉丝列表
 * @param {string} accessToken - 授权access_token
 * @param {number} tagId - 标签ID
 * @param {string} nextOpenId - 第一个拉取的OPENID，不填默认从头开始拉取
 * @returns {Promise<any>} - 返回粉丝列表
 */
export const getTagUserList = async <T>(accessToken: string, tagId: number, nextOpenId?: string): Promise<T> => {
  const url = `/cgi-bin/user/tag/get?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    tagid: tagId,
    next_openid: nextOpenId,
  });
  return response;
};

/**
 * 批量为用户打标签
 * @param {string} accessToken - 授权access_token
 * @param {number} tagId - 标签ID
 * @param {Array<string>} openIds - 用户的OPENID列表
 * @param {boolean} return_fail_openid - 是否返回未成功打标签的OPENID列表
 * @returns {Promise<any>} - 返回批量打标签结果
 */
export const batchTagging = async <T>(accessToken: string, tagId: number, openIds: Array<string>, return_fail_openid?: boolean): Promise<T> => {
  const url = `/cgi-bin/tags/members/batchtagging?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    tagid: tagId,
    openid_list: openIds,
    return_fail_openid: return_fail_openid || false,
  });
  return response;
};

/**
 * 批量为用户取消标签
 * @param {string} accessToken - 授权access_token
 * @param {number} tagId - 标签ID
 * @param {Array<string>} openIds - 用户的OPENID列表
 * @return {boolean} return_fail_openid - 是否返回未成功取消标签的OPENID列表
 * @returns {Promise<any>} - 返回批量取消标签结果
 */
export const batchUntagging = async <T>(accessToken: string, tagId: number, openIds: Array<string>, return_fail_openid?: boolean): Promise<T> => {
  const url = `/cgi-bin/tags/members/batchuntagging?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    tagid: tagId,
    openid_list: openIds,
    return_fail_openidL: return_fail_openid || false,
  });
  return response;
};

/**
 * 获取用户身上的标签列表
 * @param {string} accessToken - 授权access_token
 * @param {string} openId - 用户的OPENID
 * @returns {Promise<any>} - 返回用户身上的标签列表
 */
export const getUserTagList = async <T>(accessToken: string, openId: string): Promise<T> => {
  const url = `/cgi-bin/tags/getidlist?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    openid: openId,
  });
  return response;
};

/**
 * 设置用户备注名
 * @param {string} accessToken - 授权access_token
 * @param {string} openId - 用户的OPENID
 * @param {string} remark - 新的备注名
 * @returns {Promise<any>} - 返回设置结果
 */
export const setUserRemark = async <T>(accessToken: string, openId: string, remark: string): Promise<T> => {
  const url = `/cgi-bin/user/info/updateremark?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    openid: openId,
    remark,
  });
  return response;
};

/**
 * 获取用户基本信息（UnionID机制）
 * @param {string} accessToken - 授权access_token
 * @param {string} openId - 用户的OPENID
 * @param {string} lang - 国家地区语言版本，zh_CN 简体中文，zh_TW 繁体中文，en 英语
 * @returns {Promise<any>} - 返回用户基本信息
 */
export const getUserInfo = async <T>(accessToken: string, openId: string, lang: string = 'zh_CN'): Promise<T> => {
  const url = `/cgi-bin/user/info?access_token=${accessToken}&openid=${openId}&lang=${lang}`;
  const response = await BaseHttp.get(url);
  return response;
};

/**
 * 获取用户列表
 * @param {string} accessToken - 授权access_token
 * @param {string} nextOpenId - 第一个拉取的OPENID，不填默认从头开始拉取
 * @returns {Promise<any>} - 返回用户列表
 */
export const getUserList = async <T>(accessToken: string, nextOpenId?: string): Promise<T> => {
  const url = `/cgi-bin/user/get?access_token=${accessToken}&next_openid=${nextOpenId || ''}`;
  const response = await BaseHttp.get(url);
  return response;
};

/**
 * 获取黑名单列表
 * @param {string} accessToken - 授权access_token
 * @param {string} beginOpenId - 第一个拉取的OPENID，不填默认从头开始拉取
 * @returns {Promise<any>} - 返回黑名单列表
 */
export const getBlackList = async <T>(accessToken: string, beginOpenId?: string): Promise<T> => {
  const url = `/cgi-bin/tags/members/getblacklist?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    begin_openid: beginOpenId || '',
  });
  return response;
};
/**
 * 拉黑用户
 * @param {string} accessToken - 授权access_token
 * @param {Array<string>} openIds - 用户的OPENID列表
 * @returns {Promise<any>} - 返回拉黑结果
 */
export const batchBlackList = async <T>(accessToken: string, openIds: Array<string>): Promise<T> => {
  const url = `/cgi-bin/tags/members/batchblacklist?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    openid_list: openIds,
  });
  return response;
};

/**
 * 取消拉黑用户
 * @param {string} accessToken - 授权access_token
 * @param {Array<string>} openIds - 用户的OPENID列表
 * @returns {Promise<any>} - 返回取消拉黑结果
 */
export const batchUnBlackList = async <T>(accessToken: string, openIds: Array<string>): Promise<T> => {
  const url = `/cgi-bin/tags/members/batchunblacklist?access_token=${accessToken}`;
  const response = await BaseHttp.post(url, {
    openid_list: openIds,
  });
  return response;
};
