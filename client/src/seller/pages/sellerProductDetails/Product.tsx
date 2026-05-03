export default interface Product {
  _id: string;

  name: string;
  description: string;

  image: string[];

  mrpPrice: number;
  sellingPrice: number;
  discountPercentage: number;

  category: string;
  parentCategoryName: string;
  subCategoryName: string;
  seller: string;

  stock: number;
  needAttachment: boolean;
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
