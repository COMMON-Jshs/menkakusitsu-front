import { create } from "zustand";
import { getThemeType, ThemeType } from "../theme";
import LeafParticle from "./leaf";
import SakuraParticle from "./sakura";
import SnowParticle from "./snow";

export { default as Snow } from "./snow";
export { default as Sakura } from "./sakura";
export { default as Leaf } from "./leaf";

export interface ParticleManagerProps {
  showParticle: boolean;
}

const useParticleManagerStore = create<ParticleManagerProps>(() => ({
  showParticle: true,
}));

const getParticle = (themeType: ThemeType) => {
  switch (themeType) {
    case "spring":
      return <SakuraParticle />;
    case "fall":
      return <LeafParticle />;
    case "winter":
    case "christmas":
      return <SnowParticle />;
    default:
      return <></>;
  }
};

export default function ParticleManager() {
  const { showParticle } = useParticleManagerStore();
  const type = getThemeType();

  return showParticle ? getParticle(type) : <></>;
}

export const setParticleActive = (value: boolean) => {
  useParticleManagerStore.setState({ showParticle: value });
};
