export interface ICategory {
  _id: string;
  name: string;
  // add more fields if needed
}



export interface Product {
  _id: string;
  name: string;
  description: string[];
  image: string[];
  mrpPrice: number;
  sellingPrice: number;
  discountPercentage: number;
  category : ICategory;
  subCategory : ICategory;
  seller: string;
  ratingAverage: number;
  ratingCount: number;
  stock: number;
  needAttachment?: boolean;
  needMessage?: boolean;
  isActive: boolean;
  deletedBy: "manual" | "cascade" | null;
  sale: number;
  createdAt: Date;
  updatedAt: Date;
}
