import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadBasic } from "@tsparticles/basic";
import { loadWobbleUpdater } from "@tsparticles/updater-wobble";

export default function SnowParticle() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine, false);
      await loadWobbleUpdater(engine, false);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    init && (
      <Particles
        options={{
          particles: {
            number: {
              value: 100,
            },
            move: {
              direction: "bottom",
              enable: true,
              random: false,
              straight: false,
            },
            opacity: {
              value: { min: 0.1, max: 0.5 },
            },
            size: {
              value: { min: 1, max: 10 },
            },
            wobble: {
              distance: 20,
              enable: true,
              speed: {
                min: -5,
                max: 5,
              },
            },
          },
        }}
      />
    )
  );
}
