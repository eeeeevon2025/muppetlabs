const ILLUSTRATION_VERSION = "10";

export const MUPPET_ILLUSTRATIONS: Record<string, string> = {
  kermit: "/illustrations/kermit.png",
  "miss-piggy": "/illustrations/miss-piggy.png",
  "fozzie-bear": "/illustrations/fozzie.png",
  gonzo: "/illustrations/gonzo.png",
  animal: "/illustrations/animal.png",
  rowlf: "/illustrations/rowlf.png",
  scooter: "/illustrations/scooter.png",
  "statler-and-waldorf": "/illustrations/statler-and-waldorf.png",
  "swedish-chef": "/illustrations/swedish-chef.png",
  "bunsen-honeydew": "/illustrations/bunsen.png",
  beaker: "/illustrations/beaker.png",
  "sam-eagle": "/illustrations/sam-eagle.png",
  rizzo: "/illustrations/rizzo.png",
  pepe: "/illustrations/pepe.png",
};

export function illustrationSrc(path: string): string {
  return `${path}?v=${ILLUSTRATION_VERSION}`;
}

export function getMuppetIllustration(slug: string): string | undefined {
  const path = MUPPET_ILLUSTRATIONS[slug];
  return path ? illustrationSrc(path) : undefined;
}

export const KERMIT_ILLUSTRATION = illustrationSrc(MUPPET_ILLUSTRATIONS.kermit);
export const MISS_PIGGY_ILLUSTRATION = illustrationSrc(MUPPET_ILLUSTRATIONS["miss-piggy"]);
