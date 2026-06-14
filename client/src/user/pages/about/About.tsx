import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import FooterSkeleton from "@/user/components/skeletons/footer";
import { useUserFooter } from "../../../hooks/user/profile/useProfile";
import {
  FaBullseye,
  FaHandshake,
  FaShieldAlt,
  FaRocket,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const AboutUs = () => {
  const { sellerId, shopName } = useParams();
  const { data: footerData, isLoading } = useUserFooter(sellerId);
  if (isLoading) return <FooterSkeleton />;
  return (
    <>
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-80 h-80 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Hero Section */}
        <section className="relative py-24 px-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About{" "}
              <span className="relative inline-block">
                Us
                {/* <span className="absolute left-0 bottom-0 h-1 w-full bg-black rounded-full animate-pulse"></span> */}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
              Welcome to {shopName}, your trusted destination for quality
              products and a seamless shopping experience. We are committed to
              providing carefully selected products, excellent customer service,
              and complete satisfaction for every customer.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>

              <p className="text-gray-600 leading-8 mb-6">
                {shopName} is a dedicated online store built with a passion for
                delivering high-quality products to customers. We believe that
                shopping should be simple, secure, and enjoyable.
              </p>

              <p className="text-gray-600 leading-8">
                Every order is handled with care, ensuring that our customers
                receive the best products and service possible. Your
                satisfaction is our top priority.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Why Choose Us?</h3>

              <ul className="space-y-5 ">
                <li>✔ Premium Quality Products</li>
                <li>✔ Safe & Secure Payments</li>
                <li>✔ Fast Delivery</li>
                <li>✔ Friendly Customer Support</li>
                <li>✔ Customer Satisfaction Guaranteed</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="relative py-20 px-6 bg-linear-to-b from-white via-gray-100 to-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">
              Our Core Values
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaBullseye />,
                  title: "Mission",
                  desc: "Providing carefully selected products that meet high standards.",
                },
                {
                  icon: <FaHandshake />,
                  title: "Trust",
                  desc: "Building lasting relationships through honesty and reliability.",
                },
                {
                  icon: <FaShieldAlt />,
                  title: "Security",
                  desc: "Ensuring safe payments and protecting customer information.",
                },
                {
                  icon: <FaRocket />,
                  title: "Service",
                  desc: "Delivering exceptional support and a smooth shopping experience.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
                >
                  <div className="text-4xl text-black mx-auto mb-5 flex justify-center transition-transform duration-300 group-hover:scale-105">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

                  <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        {/* <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              ["10K+", "Happy Customers"],
              ["5K+", "Products Available"],
              ["99%", "Customer Satisfaction"],
            ].map(([value, label], index) => (
              <div
                key={index}
                className="group bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
              >
                <h2 className="text-4xl font-bold mb-2">{value}</h2>
                <p className="text-gray-600 group-hover:text-gray-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Contact Section */}
        <section className="relative py-20 px-6 bg-linear-to-b from-gray-100 to-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Contact Us</h2>

            <p className="text-gray-600 text-center mb-14">
              We'd love to hear from you. Feel free to reach out through any of
              the channels below.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaPhoneAlt />,
                  title: "Phone",
                  value: footerData.footerData.businessPhone,
                  link: `tel:${footerData.footerData.businessPhone}`,
                },
                {
                  icon: <FaWhatsapp />,
                  title: "WhatsApp",
                  value: footerData.footerData.businessWhatsapp.replace(
                    "https://wa.me/",
                    "",
                  ),
                  link: footerData.footerData.businessWhatsapp,
                },
                {
                  icon: <FaEnvelope />,
                  title: "Email",
                  value: footerData.footerData.businessEmail,
                  link: `https://mail.google.com/mail/?view=cm&fs=1&to=${footerData.footerData.businessEmail}&su=${encodeURIComponent("Customer Inquiry")}`,
                },
                {
                  icon: <FaInstagram />,
                  title: "Instagram",
                  value: footerData.footerData.bussinessInstagram,
                  link: footerData.footerData.bussinessInstagram,
                },
                {
                  icon: <FaFacebook />,
                  title: "Facebook",
                  value: footerData.footerData.bussinessFacebook,
                  link: footerData.footerData.bussinessFacebook,
                },
                {
                  icon: <FaMapMarkerAlt />,
                  title: "Click to Get Directions",
                  value:
                    footerData.footerData.address?.city ===
                    footerData.footerData.address?.emirate
                      ? `${footerData.footerData.address.area}, ${footerData.footerData.address.emirate}, UAE`
                      : `${footerData.footerData.address.area}, ${footerData.footerData.address.city}, ${footerData.footerData.address.emirate}, UAE`,
                  link: `https://www.google.com/maps/dir/?api=1&destination=${footerData.footerData.location.latitude},${footerData.footerData.location.longitude}`,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (!item.link) return;

                    // PHONE
                    if (item.link.startsWith("tel:")) {
                      window.location.href = item.link;
                      return;
                    }

                    // NORMAL LINKS
                    window.open(
                      item.link.startsWith("http")
                        ? item.link
                        : `https://${item.link}`,
                      "_blank",
                    );
                  }}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
                >
                  <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-105">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                    {item.value}
                  </p>
                  {/* {item.title === "Click to Get Directions" && (
                    <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                      {footerData.footerData.address?.city ===
                      footerData.footerData.address?.emirate
                        ? `${footerData.footerData.address.area}, ${footerData.footerData.address.emirate}, UAE`
                        : `${footerData.footerData.address.area}, ${footerData.footerData.address.city}, ${footerData.footerData.address.emirate}, UAE`}
                    </p>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer sellerId={sellerId!} />
    </>
  );
};

export default AboutUs;
