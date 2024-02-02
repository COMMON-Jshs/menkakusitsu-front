import { default as _topbar } from "topbar";

export interface TopBarConfig {
  autoRun?: boolean;
  barThickness?: number;
  barColors?: Record<number, string>;
  shadowBlur?: number;
  shadowColor?: string;
  className?: string;
}

export interface TopBar {
  show: () => void;
  hide: () => void;
  config: (conf: TopBarConfig) => void;
}

const topbar: TopBar = _topbar;

export { topbar };
