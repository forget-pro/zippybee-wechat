import fs from 'fs';

// 公众号菜单类型
export interface OfficialAccountMenu {
  button: Array<{
    type?: string;
    name: string;
    key?: string;
    url?: string;
    sub_button?: Array<{
      type: string;
      name: string;
      key?: string;
      url?: string;
    }>;
  }>;
}

// 其他全局类型声明可以添加在这里
export interface MessageContent {
  touser: string;
  msgtype: 'text' | 'image' | 'voice' | 'video' | 'music' | 'news' | 'mpnews' | 'mpnewsarticle' | 'msgmenu' | 'wxcard' | 'miniprogrampage';
  text?: {
    content: string;
  };
  image?: {
    media_id: string;
  };
  voice?: {
    media_id: string;
  };
  video?: {
    media_id: string;
    thumb_media_id: string;
    title: string;
    description: string;
  };
  music?: {
    title: string;
    description: string;
    musicurl: string;
    hqmusicurl: string;
    thumb_media_id: string;
  };
  news?: {
    articles: Array<{
      title: string;
      description: string;
      url: string;
      picurl: string;
    }>;
  };
  mpnews?: {
    media_id: string;
  };
  mpnewsarticle?: {
    article_id: string;
  };
  msgmenu?: {
    head_content: string;
    list: Array<{
      id: string;
      content: string;
    }>;
    tail_content: string;
  };
  wxcard?: {
    card_id: string;
  };
  miniprogrampage?: {
    title: string;
    appid: string;
    pagepath: string;
    thumb_media_id: string;
  };
}

// 客服账号类型
export interface CustomerServiceAccount {
  kf_account: string;
  nickname: string;
  password: string;
}

export interface MaterialUploadOptions {
  access_token: string;
  type?: string;
  media: string | Buffer | fs.ReadStream;
  filename?: string;
  description?: string;
  fieldName?: string;
  headers?: Record<string, string>;
  isPermanent?: boolean;
}

export interface QrcodeOptions {
  expire_seconds?: number;
  action_name: string;
  action_info: {
    scene: {
      scene_id?: number;
      scene_str?: string;
    };
  };
}

export interface SendSubscribeMessageOptions {
  touser: string;
  template_id: string;
  page?: string;
  data?: Record<string, any>;
  miniprogram?: {
    appid: string;
    pagepath: string;
  };
}

export interface TemplateMessageOptions {
  touser: string;
  template_id: string;
  url?: string;
  miniprogram?: {
    appid: string;
    pagepath: string;
  };
  data: Record<string, any>;
  client_msg_id?: string;
}
