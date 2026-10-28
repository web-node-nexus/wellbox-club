// Real Gold Jewellery Images - Generated High Quality Images
export const goldImages: Record<string, string> = {
  // Necklaces
  necklace1: 'https://image.qwenlm.ai/generated-images/b857601d-490d-4971-b37c-7f05cc5836cc/_result.png',
  necklace2: 'https://image.qwenlm.ai/generated-images/332611c1-d3a8-4490-b58a-5e8b93d7291f/_result.png',
  
  // Rings
  ring1: 'https://image.qwenlm.ai/generated-images/355d4aa3-9861-4604-be9c-3475efc615e5/_result.png',
  
  // Bangles/Bracelets
  bangle1: 'https://image.qwenlm.ai/generated-images/c1b95211-f127-4764-948b-aafa97cb7723/_result.png',
  
  // Earrings
  earring1: 'https://image.qwenlm.ai/generated-images/ebb7fd7d-9c81-4955-bfa2-b5c9d88d161d/_result.png',
  
  // Gold Coins & Bars
  coin1: 'https://image.qwenlm.ai/generated-images/65b8b346-e8fb-49b4-9737-96bb6fff3068/_result.png',
  coin2: 'https://image.qwenlm.ai/generated-images/65b8b346-e8fb-49b4-9737-96bb6fff3068/_result.png',
  
  // Sets
  set1: 'https://image.qwenlm.ai/generated-images/8e749698-e423-4636-9a86-a298b6e072de/_result.png',
  
  // Chains
  chain1: 'https://image.qwenlm.ai/generated-images/40009da1-5f3b-483e-93e5-332436911f14/_result.png',
  
  // General Gold/Jewellery
  gold1: 'https://image.qwenlm.ai/generated-images/b857601d-490d-4971-b37c-7f05cc5836cc/_result.png',
  gold2: 'https://image.qwenlm.ai/generated-images/355d4aa3-9861-4604-be9c-3475efc615e5/_result.png',
  gold3: 'https://image.qwenlm.ai/generated-images/c1b95211-f127-4764-948b-aafa97cb7723/_result.png',
  gold4: 'https://image.qwenlm.ai/generated-images/ebb7fd7d-9c81-4955-bfa2-b5c9d88d161d/_result.png',
  gold5: 'https://image.qwenlm.ai/generated-images/65b8b346-e8fb-49b4-9737-96bb6fff3068/_result.png',
  gold6: 'https://image.qwenlm.ai/generated-images/8e749698-e423-4636-9a86-a298b6e072de/_result.png',
  gold7: 'https://image.qwenlm.ai/generated-images/332611c1-d3a8-4490-b58a-5e8b93d7291f/_result.png',
  gold8: 'https://image.qwenlm.ai/generated-images/40009da1-5f3b-483e-93e5-332436911f14/_result.png',
};

// Design to image mapping
export const designImages: Record<string, string> = {
  'Royal Necklace Set': goldImages.necklace1,
  'Antique Bangles Pair': goldImages.bangle1,
  'Diamond Cut Chain': goldImages.chain1,
  'Temple Jewelry Set': goldImages.set1,
  'Minimalist Ring': goldImages.ring1,
  'Jhumka Earrings': goldImages.earring1,
  'Gold Coin 10g': goldImages.coin1,
  'Bridal Choker': goldImages.necklace2,
  'Anklet Pair': goldImages.bangle1,
  'Mangalsutra': goldImages.chain1,
  'Nose Ring': goldImages.earring1,
  'Gold Bar 50g': goldImages.coin2,
};

export function getGoldImage(designName: string): string {
  return designImages[designName] || goldImages.gold1;
}

export function getRandomGoldImage(): string {
  const images = Object.values(goldImages);
  return images[Math.floor(Math.random() * images.length)];
}
