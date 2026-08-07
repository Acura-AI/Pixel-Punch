import { PresetSample } from "../types";

const toBase64SvgUri = (svgStr: string) => {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
  }
  return "data:image/svg+xml;base64," + Buffer.from(svgStr, "utf-8").toString("base64");
};

// Clean SVG definitions for 3 realistic sample landing page screenshots
const saasLandingSvg = toBase64SvgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none"><rect width="800" height="600" fill="#0F172A"/><rect x="40" y="30" width="120" height="30" rx="6" fill="#38BDF8"/><rect x="600" y="30" width="160" height="36" rx="18" fill="#6366F1"/><text x="400" y="160" fill="white" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">Supercharge Your Synergy With AI Power!</text><text x="400" y="200" fill="#94A3B8" font-family="sans-serif" font-size="16" text-anchor="middle">The ultimate all-in-one quantum cloud platform for enterprise teams.</text><rect x="300" y="230" width="200" height="50" rx="8" fill="#38BDF8"/><text x="400" y="262" fill="black" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Start Free Trial Now</text><rect x="60" y="320" width="680" height="240" rx="12" fill="#1E293B" stroke="#334155" stroke-width="2"/><text x="400" y="440" fill="#64748B" font-family="sans-serif" font-size="20" text-anchor="middle">[ Cluttered Dashboard Screenshot Here ]</text></svg>`
);

const web3CryptoSvg = toBase64SvgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none"><rect width="800" height="600" fill="#050505"/><circle cx="400" cy="200" r="180" fill="#A855F7" opacity="0.25"/><text x="400" y="150" fill="#E9D5FF" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">NEXT-GEN DECENTRALIZED PROTOCOL</text><text x="400" y="195" fill="#A855F7" font-family="sans-serif" font-size="15" text-anchor="middle">Hyper-tokenized zk-rollup liquidity staking ecosystem on mainnet</text><rect x="320" y="230" width="160" height="44" rx="22" fill="#EC4899"/><text x="400" y="258" fill="white" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Connect Wallet</text><rect x="100" y="320" width="180" height="120" rx="8" fill="#18181B"/><text x="190" y="380" fill="#22C55E" font-family="sans-serif" font-size="24" text-anchor="middle">$4.2B TVL</text><rect x="310" y="320" width="180" height="120" rx="8" fill="#18181B"/><text x="400" y="380" fill="#A855F7" font-family="sans-serif" font-size="24" text-anchor="middle">10,000% APY</text><rect x="520" y="320" width="180" height="120" rx="8" fill="#18181B"/><text x="610" y="380" fill="#3B82F6" font-family="sans-serif" font-size="24" text-anchor="middle">0.0001s Sync</text></svg>`
);

const genericAgencySvg = toBase64SvgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none"><rect width="800" height="600" fill="#FFFFFF"/><rect x="40" y="30" width="140" height="30" fill="#111827"/><text x="40" y="140" fill="#111827" font-family="sans-serif" font-size="40" font-weight="bold">We Craft Digital Experiences That Scale.</text><text x="40" y="190" fill="#4B5563" font-family="sans-serif" font-size="16">Full-service digital transformation agency driven by passion and innovation.</text><rect x="40" y="220" width="180" height="48" fill="#111827"/><text x="130" y="250" fill="white" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Book a Call</text><rect x="40" y="300" width="720" height="2" fill="#E5E7EB"/><text x="400" y="360" fill="#9CA3AF" font-family="sans-serif" font-size="18" text-anchor="middle">Trust By 500+ Generic Brands You Never Heard Of</text></svg>`
);

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "saas-ai",
    name: "Buzzword AI SaaS",
    tagline: "Cluttered dark mode with 'supercharge' headlines",
    url: "https://synergy-ai-cloud.example.com",
    badge: "SaaS Trap",
    thumbnail: saasLandingSvg,
  },
  {
    id: "web3-crypto",
    name: "Cryptic Web3 Token",
    tagline: "Glow effects, jargon overload, zero clear benefits",
    url: "https://zk-rollup-token.example.io",
    badge: "Crypto Hype",
    thumbnail: web3CryptoSvg,
  },
  {
    id: "generic-agency",
    name: "Boring B2B Agency",
    tagline: "Corporate speak, 'craft experiences' and zero pricing",
    url: "https://digital-apex-solutions.example.net",
    badge: "B2B Snooze",
    thumbnail: genericAgencySvg,
  },
];
