import { getThemeType, ThemeType } from "@/components/theme";
import { LeafParticle } from "@/components/particle/leaf";
import { SakuraParticle } from "@/components/particle/sakura";
import { SnowParticle } from "@/components/particle/snow";
import { useParticleManagerStore } from "@/components/particle/hooks";

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

export function ParticleComponent() {
  const { showParticle } = useParticleManagerStore();
  const type = getThemeType();

  return showParticle ? getParticle(type) : <></>;
}
