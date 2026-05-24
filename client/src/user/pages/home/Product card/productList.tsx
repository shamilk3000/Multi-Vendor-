// import React from 'react'
import ProductCardsHome from "../Product card/ProductCardsHome";
type ProductListProps = {
  sellerId: string;
  shopName: string;
};

function productList({ sellerId, shopName }: ProductListProps) {
  return (
    <div className="mt-5">
      <ProductCardsHome  sellerId ={sellerId} shopName={shopName} />

      <div className="text-center pb-5 py-4 px-6">
        <h2 className="font-bold text-xl md:text-3xl">
          Thanks for shopping with us 😄
        </h2>
      </div>
    </div>
  );
}

export default productList;
