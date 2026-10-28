// Real Gold Jewellery Images from Unsplash
export const goldImages: Record<string, string> = {
  // Necklaces
  necklace1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
  necklace2: 'https://images.unsplash.com/photo-1515562141589-67f0d569b9c6?w=400&q=80',
  necklace3: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
  necklace4: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
  
  // Rings
  ring1: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
  ring2: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80',
  ring3: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80',
  
  // Bangles/Bracelets
  bangle1: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80',
  bangle2: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
  bangle3: 'https://images.unsplash.com/photo-1601821366011-6a7f6a014c85?w=400&q=80',
  
  // Earrings
  earring1: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80',
  earring2: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&q=80',
  earring3: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80',
  
  // Gold Coins & Bars
  coin1: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80',
  coin2: 'https://images.unsplash.com/photo-1623282033858-168b164384dd?w=400&q=80',
  coin3: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80',
  
  // Sets
  set1: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&q=80',
  set2: 'https://images.unsplash.com/photo-1573408301183-78f69db41560?w=400&q=80',
  
  // Chains
  chain1: 'https://images.unsplash.com/photo-1620656798932-902f3736e64f?w=400&q=80',
  chain2: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80',
  
  // General Gold/Jewellery
  gold1: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80',
  gold2: 'https://images.unsplash.com/photo-1515562141589-67f0d569b9c6?w=400&q=80',
  gold3: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
  gold4: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
  gold5: 'https://images.unsplash.com/photo-1573408301183-78f69db41560?w=400&q=80',
  gold6: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
  gold7: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
  gold8: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80',
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
  'Anklet Pair': goldImages.bangle2,
  'Mangalsutra': goldImages.chain2,
  'Nose Ring': goldImages.earring2,
  'Gold Bar 50g': goldImages.coin2,
};

export function getGoldImage(designName: string): string {
  return designImages[designName] || goldImages.gold1;
}

export function getRandomGoldImage(): string {
  const images = Object.values(goldImages);
  return images[Math.floor(Math.random() * images.length)];
}
