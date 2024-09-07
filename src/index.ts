export enum barkLevel {
  // 默认值，系统会自动亮屏显示通知
  active = "active",
  // 时效性通知，可在专注模式下显示通知
  timeSensitive = "timeSensitive",
  // 仅将通知添加到通知中心，不会有横幅提示
  passive = "passive",
}

export interface barkParams {
  // 标题 必填
  title: string;
  // 内容
  body?: string;
  // 消息级别
  level?: barkLevel;
  // 角标 仅支持数字
  badge?: string;
  //   自动复制
  autoCopy?: boolean;
  //   复制内容
  copy?: string;
  //   提示音
  sound?: string;
  //   自定义图标
  icon?: string;
  //   分组
  group?: string;
  //   是否存档 默认值：false
  isArchive?: boolean;
  //   跳转链接
  url?: string;
}

export interface barkResponse {
  code: number;
  message: string;
  timestamp: number;
}

export class BarkSDK {
  private readonly secretKey: string;
  private readonly baseURL: string;

  constructor(secretKey: string, host: string = "https://api.day.app") {
    this.secretKey = secretKey;
    this.baseURL = host;
  }

  async notify(body: barkParams): Promise<barkResponse> {
    try {
      const response = await fetch(`${this.baseURL}/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          ...body,
          device_key: this.secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: barkResponse = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`[BarkSDK][ERROR] ${error.message}`);
        return {
          code: 500,
          message: error.message,
          timestamp: Date.now(),
        };
      } else {
        console.error(`[BarkSDK][ERROR]`, error);
        return {
          code: 500,
          message: "Unknown error",
          timestamp: Date.now(),
        };
      }
    }
  }
}
