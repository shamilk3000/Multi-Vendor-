import { useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "./Banner/Banner";
import ProductList from "./Product card/productList";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import CategoryMegaMenu from "./Category/CategoryMegaMenu";
import FilteredProducts from "./Product card/FilteredProducts";

function Home() {
  const { sellerId, shopName } = useParams();

  const [selectedCategory, setSelectedCategory] = useState({
    categoryName: "",
    categoryId: "",
  });

  return (
    <div>
      <section>
        <Navbar shopName={shopName!} sellerId={sellerId!} />
        <Banner shopName={shopName!} sellerId={sellerId!} />
      </section>

      <div className="hidden md:block">
        <CategoryMegaMenu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <section>
        {selectedCategory.categoryId ? (
          <FilteredProducts
            sellerId={sellerId!}
            shopName={shopName!}
            categoryId={selectedCategory.categoryId}
            categoryName={selectedCategory.categoryName}
            setSelectedCategoryId={() =>
              setSelectedCategory({
                categoryId: "",
                categoryName: "",
              })
            }
          />
        ) : (
          <ProductList sellerId={sellerId!} shopName={shopName!} />
        )}
      </section>

      <section>
        <Footer sellerId={sellerId!} />
      </section>
    </div>
  );
}

export default Home;
