// import React from "react";
import FooterSkeleton from "@/user/components/skeletons/footer";
import { useUserFooter } from "../../../hooks/user/profile/useProfile";
import { useNavigate } from "react-router-dom";
type FooterProps = {
  sellerId: string;
};

const Footer = ({ sellerId }: FooterProps) => {
  const navigate = useNavigate();
  const { data: footerData, isLoading } = useUserFooter(sellerId);
  if (isLoading) return <FooterSkeleton />;
  return (
    <footer className="bg-black text-white py-8 overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-center flex-wrap gap-6 font-medium mb-12">
        {
          // ["Home", "About", "Services", "Contact"]
          [
            {
              name: "Home",
              link: `/${sellerId}/${footerData?.footerData?.bussinessName}`,
            },
            {
              name: "About Us",
              link: `/${sellerId}/${footerData?.footerData?.bussinessName}/about`,
            },
          ].map((item) => (
            <a
              key={item.name}
              onClick={() => navigate(item.link)}
              className="relative group transition hover:text-gray-300 cursor-pointer"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300" />
            </a>
          ))
        }
      </nav>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mb-12">
        {[
          {
            name: "Instagram",
            icon: "instagram-new",
            link: footerData.footerData.bussinessInstagram,
          },
          {
            name: "Phone",
            icon: "phone",
            link: `tel:${footerData.footerData.businessPhone}`,
          },
          {
            name: "WhatsApp",
            icon: "whatsapp",
            link: footerData.footerData.businessWhatsapp,
          },
          {
            name: "Facebook",
            icon: "facebook-new",
            link: footerData.footerData.bussinessFacebook,
          },
        ].map((social, i) => (
          <button
            key={social.name}
            onClick={() => {
              if (!social.link) return;

              // PHONE
              if (social.link.startsWith("tel:")) {
                window.location.href = social.link;
                return;
              }

              // NORMAL LINKS
              window.open(
                social.link.startsWith("http")
                  ? social.link
                  : `https://${social.link}`,
                "_blank",
              );
            }}
            className="relative group"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {/* Ripple */}
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-active:animate-ripple" />

            {/* Icon Container */}
            <div
              className="
        w-12 h-12
        flex items-center justify-center
        rounded-full
        bg-white text-black
        border border-white
        transition-all duration-300
        animate-float

        group-hover:bg-black
        group-hover:rotate-12
        group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]
        group-hover:scale-110
      "
            >
              <img
                src={`https://img.icons8.com/ios-filled/24/000000/${social.icon}.png`}
                alt={social.name}
                className="transition group-hover:invert"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-400 text-sm">© Started in 2026.</p>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          @keyframes ripple {
            0% {
              transform: scale(0.4);
              opacity: 0.4;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }

          .animate-ripple {
            animation: ripple 0.6s ease-out;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
