import { AxiosRequestConfig } from 'axios';
// 确保TypeScript将此文件视为模块，并导出所有接口
export interface PayConfig {
  apiClientkey: string; //API证书私钥
  publicKey: string; // 微信公钥 or 平台证书
  mch_id: string; //商户号
  appid: string; //小程序appid
  serial_no: string; //API证书序列号
  apiV3key: string; //APIv3密钥
}

export interface SignParams {
  methods: AxiosRequestConfig['method'];
  url: string;
  timestamp: number | string;
  nonce_str: string;
  params?: Record<string, any>;
}

export interface OrderDetail {
  cost_price?: number;
  invoice_id?: string;
  goods_detail?: Array<{
    merchant_goods_id: string;
    wechatpay_goods_id: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface RefundGoodsDetail {
  merchant_goods_id: string;
  wechatpay_goods_id?: string;
  goods_name?: string;
  unit_price: number;
  refund_amount: number;
  refund_quantity: number;
}

export interface SceneInfo {
  payer_client_ip: string;
  device_id?: string;
  store_info?: {
    id: string;
    name?: string;
    address?: string;
    area_code?: string;
  };
}

export interface UnifiedOrderParams {
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  support_fapiao?: string;
  amount: {
    total: number;
    currency?: string;
  };
  payer: {
    openid: string;
  };
  detail?: OrderDetail;
  scene_info?: SceneInfo;
  settle_info?: {
    profit_sharing?: boolean;
  };
}

export interface RefundParams {
  transaction_id?: string;
  out_trade_no?: string;
  out_refund_no: string;
  reason?: string;
  notify_url?: string;
  funds_account?: string;
  amount: {
    refund: number;
    total: number;
    currency: string;
    from?: Array<{ account: string; amount: number }>;
  };
  goods_detail?: Array<RefundGoodsDetail>;
}

export interface ExceptionRefundParams {
  refund_id: string;
  out_refund_no: string;
  type: 'USER_BANK_CARD' | 'MERCHANT_BANK_CARD';
  bank_type?: string;
  bank_account?: string;
  real_name?: string;
}

export interface AppUnifiedOrderParams {
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  support_fapiao?: string;
  amount: {
    total: number;
    currency?: string;
  };
  detail?: OrderDetail;
  scene_info?: SceneInfo;
  settle_info?: {
    profit_sharing?: boolean;
  };
}

export interface CombineUnifiedOrderParams {
  combine_appid?: string;
  combine_out_trade_no: string;
  combine_mchid?: string;
  scene_info?: {
    device_id?: string;
    payer_client_ip: string;
  };
  sub_orders: Array<{
    mchid: string;
    attach: string;
    amount: {
      total_amount: number;
      currency: string;
    };
    out_trade_no: string;
    detail?: string;
    description: string;
    settle_info?: {
      profit_sharing?: boolean;
    };
  }>;
  combine_payer_info: {
    openid: string;
  };
  time_expire?: string;
  notify_url?: string;
}

export interface CloseCombineOrderParams {
  combine_out_trade_no: string;
  combine_appid?: string;
  sub_orders: Array<{
    mchid: string;
    out_trade_no: string;
  }>;
}

export interface RefundCombineOrderParams {
  transaction_id?: string;
  out_trade_no?: string;
  out_refund_no: string;
  reason?: string;
  notify_url?: string;
  funds_account?: string;
  amount: {
    refund: number;
    from?: {
      account: string;
      amount: number;
    }[];
    total: number;
    currency: string;
  };
  goods_detail?: RefundGoodsDetail[];
}

export interface DecryptCallbackSignParams {
  timestamp: string;
  nonce: string;
  signature: string;
  body: Record<string, any> | string;
}
