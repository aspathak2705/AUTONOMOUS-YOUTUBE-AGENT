// Central typed asset manifest for Indian Vintage Poster design system

// Illustrations
import workstationWebp from './illustrations/workstation.webp';
import workstationPng from './illustrations/workstation.png';
import mediaGardenWebp from './illustrations/media_garden.webp';
import mediaGardenPng from './illustrations/media_garden.png';

// Medallions
import medallionGoldSunWebp from './medallions/medallion_gold_sun.webp';
import medallionGoldSunPng from './medallions/medallion_gold_sun.png';
import medallionTealLotusWebp from './medallions/medallion_teal_lotus.webp';
import medallionTealLotusPng from './medallions/medallion_teal_lotus.png';
import medallionRubyShieldWebp from './medallions/medallion_ruby_shield.webp';
import medallionRubyShieldPng from './medallions/medallion_ruby_shield.png';
import medallionSaffronMandalaWebp from './medallions/medallion_saffron_mandala.webp';
import medallionSaffronMandalaPng from './medallions/medallion_saffron_mandala.png';
import medallionPeacockWheelWebp from './medallions/medallion_peacock_wheel.webp';
import medallionPeacockWheelPng from './medallions/medallion_peacock_wheel.png';
import medallionEmeraldStarWebp from './medallions/medallion_emerald_star.webp';
import medallionEmeraldStarPng from './medallions/medallion_emerald_star.png';

// Ornaments
import cornerTlWebp from './ornaments/corner_tl.webp';
import cornerTlPng from './ornaments/corner_tl.png';
import cornerTrWebp from './ornaments/corner_tr.webp';
import cornerTrPng from './ornaments/corner_tr.png';
import headerCrestWebp from './ornaments/header_crest.webp';
import headerCrestPng from './ornaments/header_crest.png';
import dividerRibbonWebp from './ornaments/divider_ribbon.webp';
import dividerRibbonPng from './ornaments/divider_ribbon.png';
import flourishCenterWebp from './ornaments/flourish_center.webp';
import flourishCenterPng from './ornaments/flourish_center.png';
import badgeDiyaWebp from './ornaments/badge_diya.webp';
import badgeDiyaPng from './ornaments/badge_diya.png';
import badgeLotusWebp from './ornaments/badge_lotus.webp';
import badgeLotusPng from './ornaments/badge_lotus.png';

export interface DualAsset {
  webp: string;
  png: string;
  alt: string;
}

export const illustrations = {
  workstation: {
    webp: workstationWebp,
    png: workstationPng,
    alt: 'Ornate Indian Video Editing Workstation',
  },
  mediaGarden: {
    webp: mediaGardenWebp,
    png: mediaGardenPng,
    alt: 'Ornate Vintage Media Garden',
  },
} as const;

export const medallions = {
  goldSun: {
    webp: medallionGoldSunWebp,
    png: medallionGoldSunPng,
    alt: 'Gold Sun Play Medallion',
  },
  tealLotus: {
    webp: medallionTealLotusWebp,
    png: medallionTealLotusPng,
    alt: 'Teal Lotus Play Medallion',
  },
  rubyShield: {
    webp: medallionRubyShieldWebp,
    png: medallionRubyShieldPng,
    alt: 'Ruby Shield Play Medallion',
  },
  saffronMandala: {
    webp: medallionSaffronMandalaWebp,
    png: medallionSaffronMandalaPng,
    alt: 'Saffron Mandala Play Medallion',
  },
  peacockWheel: {
    webp: medallionPeacockWheelWebp,
    png: medallionPeacockWheelPng,
    alt: 'Peacock Wheel Play Medallion',
  },
  emeraldStar: {
    webp: medallionEmeraldStarWebp,
    png: medallionEmeraldStarPng,
    alt: 'Emerald Star Play Medallion',
  },
} as const;

export const ornaments = {
  cornerTl: {
    webp: cornerTlWebp,
    png: cornerTlPng,
    alt: 'Ornamental Top Left Corner Flourish',
  },
  cornerTr: {
    webp: cornerTrWebp,
    png: cornerTrPng,
    alt: 'Ornamental Top Right Corner Flourish',
  },
  headerCrest: {
    webp: headerCrestWebp,
    png: headerCrestPng,
    alt: 'Ornamental Header Arch Crest',
  },
  dividerRibbon: {
    webp: dividerRibbonWebp,
    png: dividerRibbonPng,
    alt: 'Decorative Divider Ribbon',
  },
  flourishCenter: {
    webp: flourishCenterWebp,
    png: flourishCenterPng,
    alt: 'Center Floral Flourish',
  },
  badgeDiya: {
    webp: badgeDiyaWebp,
    png: badgeDiyaPng,
    alt: 'Diya Lamp Sacred Badge',
  },
  badgeLotus: {
    webp: badgeLotusWebp,
    png: badgeLotusPng,
    alt: 'Lotus Bloom Sacred Badge',
  },
} as const;
