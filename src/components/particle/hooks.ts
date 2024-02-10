import { create } from "zustand";

export type ParticleManagerProps = {
  showParticle: boolean;
};

export const useParticleManagerStore = create<ParticleManagerProps>(() => ({
  showParticle: true,
}));

export const setParticleActive = (value: boolean) => {
  useParticleManagerStore.setState({ showParticle: value });
};
