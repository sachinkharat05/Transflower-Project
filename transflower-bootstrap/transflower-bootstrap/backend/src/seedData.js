const seedUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: 'pass123', phone: '9876543210' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'pass123', phone: '9123456789' }
];

const seedProducts = [
  { id: 1, name: 'Red Roses', price: 499, category: 'Roses', image: 'image/red rose.jpg' },
  { id: 2, name: 'Tulip Delight', price: 399, category: 'Tulips', image: 'image/tublips.jpg' },
  { id: 3, name: 'Sunflower Joy', price: 299, category: 'Sunflowers', image: 'image/sun.jpg' },
  { id: 4, name: 'Red Rose Bouquet', price: 799, category: 'Bouquets', image: 'image/Red Rose  Bouquets.jpg' },
  { id: 5, name: 'Yellow Roses', price: 599, category: 'Roses', image: 'image/Yellow Roses.jpg' },
  { id: 6, name: 'White Orchid Bouquet', price: 899, category: 'Orchids', image: 'image/white orchids bouquet.jpg' },
  { id: 7, name: 'White Rose', price: 549, category: 'Roses', image: 'image/White Rose.jpg' },
  { id: 8, name: 'Yellow Tulips Bouquet', price: 699, category: 'Tulips', image: 'image/Yellow Tulips  Bouquets.jpg' },
  { id: 9, name: 'Purple Orchid Bouquet', price: 999, category: 'Orchids', image: 'image/Purple orchid bouquet.jpg' }
];

module.exports = {
  seedUsers,
  seedProducts
};
