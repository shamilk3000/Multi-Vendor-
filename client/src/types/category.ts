export interface Category {
  _id: string;
  name: string;
  sellerId: string;
  parentCategory: string | null;
  sale: number;
  isActive: boolean;
  deletedBy: "manual" | "cascade" | null;
  productCount?: number;
  childrenCount?: number; 
  totalProductCount?: number;   
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}