/** Plant image utilities — maps plant IDs to PNG filenames and generates <img> tags */
const PLANT_IMAGE_MAP: Record<string, string> = {
  cherry_blossom:       '1TECH-CherryBlossomTree.png',
  magnolia:             '1HEALTHCARE-MagnoliaTree.png',
  flame_tree:           '1ENERGY-FlameTree.png',
  apple_tree:           '1FINANCE-AppleTree.png',
  camellia:             '1USTREASURYBONDS-CameliaBush.png',
  hydrangea:            '1CORPORATEBONDS-HydrangeaBush.png',
  hibiscus:             '1HIGHYIELDBONDS-HibiscusBush.png',
  bougainvillea:        '1EMERGINGMARKETBONDS-BougainvilleaBush.png',
  meadow_grass_usd:     '1USD-TallMeadowGrass.png',
  edelweiss:            '1CHF-AlpineEdelweissGrass.png',
  clover_eur:           '1EUR-CloverGrass.png',
  silver_grass_jpy:     '1JPY-JapaneseSilverGrass.png',
  golden_barrel:        '1GOLD-GoldenBarrelCactus.png',
  night_blooming_cactus:'1OIL-NightBloomingCactus.png',
  prickly_pear:         '1WHEAT-PricklyPearCactus.png',
  cholla:               '1COPPER-ChollaCactus.png',
  white_phalaenopsis:   '1BITCOIN-WhitePhalaenopsisOrchid.png',
  purple_dendrobium:    '1ETHEREUM-PurpleOrchid.png',
  blue_exotic_orchid:   '1SOLANA-NeonBlueOrchid.png',
  green_cymbidium:      '1STABLECOM-GreenCymbidiumOrchid.png',
}

/**
 * Returns an <img> tag for the plant, or the emoji as fallback.
 * @param plantId - The plant's ID
 * @param emoji   - Fallback emoji
 * @param size    - CSS size (e.g. '32px', '48px')
 */
export function plantImg(plantId: string, emoji: string, size: string = '32px'): string {
  const file = PLANT_IMAGE_MAP[plantId]
  if (file) {
    return `<img src="./assets/plants/${file}" alt="${plantId}" style="width: ${size}; height: ${size}; object-fit: contain;" draggable="false">`
  }
  return `<span style="font-size: ${size}; line-height: 1;">${emoji}</span>`
}

/** Returns the image URL for a plant, or empty string if none */
export function plantImgUrl(plantId: string): string {
  const file = PLANT_IMAGE_MAP[plantId]
  return file ? `./assets/plants/${file}` : ''
}

export { PLANT_IMAGE_MAP }
