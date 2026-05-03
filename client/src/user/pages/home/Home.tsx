import React from "react";
import { useParams } from "react-router-dom";
// import Categories from './Categories/Categories'
import Banner from "./Banner/Banner";
import ProductList from "./Product card/productList";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

function Home() {
    const { sellerId, shopName } = useParams();

  console.log("Seller ID:", sellerId);
  console.log("Shop Name:", shopName);
  return (
    <div>
      <section>
        <Navbar />
        <Banner />
      </section>
      {/* <section>
        <Categories/>
      </section> */}
      <section>
        <ProductList  sellerId={sellerId!}  />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}

export default Home;
