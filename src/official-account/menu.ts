// 菜单
import { BaseHttp } from './base.http';
import { OfficialAccountMenu } from './type';
import util from 'util';

/**
 * 创建菜单按钮
 * @param access_token 公众号的access_token
 * @param menu 菜单按钮
 * @returns
 */
export const createMenu = async <T>(access_token: string, menu: OfficialAccountMenu): Promise<T> => {
  const url = util.format('/cgi-bin/menu/create?access_token=%s', access_token);
  const response = await BaseHttp.post(url, menu);
  return response;
};

/**查询菜单按钮 */
export const getMenu = async <T>(access_token: string): Promise<T> => {
  const url = util.format('/cgi-bin/get_current_selfmenu_info?access_token=%s', access_token);
  const response = await BaseHttp.get(url);
  return response;
};

/**
 * 删除菜单按钮
 * @param access_token 公众号的access_token
 * @returns
 */
export const deleteMenu = async <T>(access_token: string): Promise<T> => {
  const url = util.format('/cgi-bin/menu/delete?access_token=%s', access_token);
  const response = await BaseHttp.get(url);
  return response;
};
