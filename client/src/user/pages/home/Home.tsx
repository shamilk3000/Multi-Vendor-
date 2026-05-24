// import React from "react";
import { useParams } from "react-router-dom";
// import Categories from './Categories/Categories'
import Banner from "./Banner/Banner";
import ProductList from "./Product card/productList";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

function Home() {
    const { sellerId, shopName } = useParams();

  return (
    <div>
      <section>
       <Navbar shopName={shopName!}  sellerId={sellerId!}/>
        <Banner shopName={shopName!}/>
      </section>
      {/* <section>
        <Categories/>
      </section> */}
      <section>
        <ProductList  sellerId={sellerId!}  shopName={shopName!}/>
      </section>
      <section>
        <Footer  sellerId={sellerId!} />
      </section>
    </div>
  );
}

export default Home;
