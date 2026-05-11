export default interface Product {
  _id: string;

  name: string;
  description:  string[];

  image: string[];

  mrpPrice: number;
  sellingPrice: number;
  discountPercentage: number;
 subCategory: string;
  category: string;
  seller: string;

  ratingAverage: number;
  ratingCount: number;

  stock: number;
  needAttachment: boolean;
  needMessage: boolean;
  isActive: boolean;

  sale: number;

  createdAt: string;
  updatedAt: string;

  // Extra rating analytics
  average: number;
  totalRatings: number;

  breakdown: {
    stars: number;
    count: number;
  }[];
}
