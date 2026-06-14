import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaStore,
  FaUniversity,
  FaCreditCard,
  FaUser,
  FaRegCreditCard,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { useSellerProfile } from "../../../hooks/seller/profile/useProfile";
import SellerProfileSkeleton from "@/seller/components/skeletons/profileSkeleton";

const Row = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3 text-sm py-1">
    <div className="text-gray-500 mt-1">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-black font-medium">{value || "-"}</p>
    </div>
  </div>
);
const SellerFullProfile = () => {
  const navigate = useNavigate();
  const { data: seller, isLoading } = useSellerProfile();

  if (isLoading) return <SellerProfileSkeleton />;

  return (
    <>
      <div className=" flex justify-center">
        <div className="w-full border rounded-2xl shadow-md p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
              {seller?.name?.charAt(0)}
            </div>

            <h1 className="text-2xl font-bold mt-3 flex items-center justify-center gap-2">
              <FaUserTie />
              {seller?.name}
            </h1>

            <p className="text-gray-500 text-sm">
              {seller.businessDetails.bussinessName}
            </p>
          </div>

          {/* PERSONAL INFO */}
          <div className="border rounded-xl p-5 mb-5 bg-white hover:shadow-2xl">
            <h2 className="font-semibold mb-3">Personal Details</h2>

            <Row icon={<FaUser />} label="Name" value={seller.name} />
            <Row
              icon={<FaPhone className="rotate-90 " />}
              label="Phone"
              value={seller.phone}
            />
            <Row icon={<FaEnvelope />} label="Email" value={seller.email} />
            <Row
              icon={<FaClock />}
              label="Expires"
              value={
                seller.subscriptionExpiry
                  ? new Date(seller.subscriptionExpiry).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : "N/A"
              }
            />
          </div>

          {/* ADDRESS */}
          <div className="border rounded-xl p-5 mb-5 bg-white hover:shadow-2xl">
            <h2 className="font-semibold mb-3">Address</h2>

            <Row
              icon={<FaMapMarkerAlt />}
              label="Flat/Villa"
              value={seller.address.flatNoOrVillaNo}
            />
            <Row
              icon={<FaMapMarkerAlt />}
              label="Street"
              value={seller.address.street}
            />
            <Row icon={<FaCity />} label="Area" value={seller.address.area} />
            <Row icon={<FaCity />} label="City" value={seller.address.city} />
            <Row
              icon={<FaGlobe />}
              label="Emirate"
              value={seller.address.emirate}
            />
            <Row
              icon={<FaMapMarkerAlt />}
              label="Landmark"
              value={seller.address.landmark}
            />
            <Row
              icon={<FaMapMarkerAlt />}
              label="Postal Code"
              value={seller.address.postalCode}
            />
          </div>

          {/* BUSINESS */}
          <div className="border rounded-xl p-5 mb-5 bg-white hover:shadow-2xl">
            <h2 className="font-semibold mb-3">Business Details</h2>

            <Row
              icon={<FaStore />}
              label="Business Name"
              value={seller.businessDetails.bussinessName}
            />

            <Row
              icon={<FaEnvelope />}
              label="Business Email"
              value={seller.businessDetails.businessEmail}
            />

            <Row
              icon={<FaPhone className="rotate-90" />}
              label="Business Phone"
              value={seller.businessDetails.bussinessPhone}
            />

            <Row
              icon={<FaInstagram />}
              label="Instagram"
              value={
                <a
                  href={`https://${seller.businessDetails.bussinessInstagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline font-medium text-sm"
                >
                  Open Instagram
                </a>
              }
            />

            <Row
              icon={<FaFacebook />}
              label="Facebook"
              value={
                <a
                  href={`https://${seller.businessDetails.bussinessFacebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-medium text-sm"
                >
                  Open Facebook
                </a>
              }
            />

            <Row
              icon={<FaWhatsapp />}
              label="WhatsApp"
              value={
                <a
                  href={`${seller.businessDetails.bussinessWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline font-medium text-sm"
                >
                  Chat on WhatsApp
                </a>
              }
            />

            <Row
              icon={<FaClock />}
              label="Opening Hours"
              value={seller.businessDetails?.openingHours || "Not set"}
            />

            <Row
              icon={<FaCalendarAlt />}
              label="Working Days"
              value={seller.businessDetails?.workingDays || "Not set"}
            />

            <div className="mt-4 border-t pt-3">
              <p className="text-xs text-gray-400 mb-2">Business Address</p>

              <Row
                icon={<FaMapMarkerAlt />}
                label="Flat/Villa"
                value={seller.businessDetails.businessAddress.flatNoOrVillaNo}
              />
              <Row
                icon={<FaMapMarkerAlt />}
                label="Street"
                value={seller.businessDetails.businessAddress.street}
              />
              <Row
                icon={<FaCity />}
                label="Area"
                value={seller.businessDetails.businessAddress.area}
              />
              <Row
                icon={<FaCity />}
                label="City"
                value={seller.businessDetails.businessAddress.city}
              />
              <Row
                icon={<FaGlobe />}
                label="Emirate"
                value={seller.businessDetails.businessAddress.emirate}
              />
              <Row
                icon={<FaMapMarkerAlt />}
                label="Landmark"
                value={seller.businessDetails.businessAddress.landmark}
              />
              <Row
                icon={<FaMapMarkerAlt />}
                label="Postal Code"
                value={seller.businessDetails.businessAddress.postalCode}
              />
            </div>
            <div className="mt-4 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 px-4 py-3 font-medium flex items-center gap-2">
                <FaMapMarkerAlt />
                Shop Location
              </div>

              <iframe
                title="Shop Location"
                className="w-full h-80"
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${seller.businessDetails.businessLocation.latitude},${seller.businessDetails.businessLocation.longitude}&z=16&output=embed`}
              />
            </div>
          </div>

          {/* BANKING */}
          <div className="border rounded-xl p-5 bg-white hover:shadow-2xl">
            <h2 className="font-semibold mb-3">Banking Details</h2>

            <Row
              icon={<FaUserTie />}
              label="Account Holder"
              value={seller.bankingDetails.accountHolderName}
            />
            {/* <Row
              icon={<FaCreditCard />}
              label="Account Number"
              value={seller.bankingDetails.accountNumber}
            /> */}
            <Row
              icon={<FaUniversity />}
              label="Bank Name"
              value={seller.bankingDetails.bankName}
            />
            <Row
              icon={<FaCreditCard />}
              label="IBAN"
              value={seller.bankingDetails.IBANnumber}
            />
            {/* <Row
              icon={<FaRegCreditCard />}
              label="Stripe ID"
              value={seller.bankingDetails.stripeAccountId}
            /> */}
          </div>

          {/* FILES (dummy placeholders) */}
          <div className="border rounded-xl p-5 mt-5 bg-white hover:shadow-2xl">
            <h2 className="font-semibold mb-1">Documents</h2>

            <p className="text-sm text-gray-500">
              Personal Image:{" "}
              {seller.personalImage ? "Uploaded" : "Not Uploaded"}
            </p>

            <p className="text-sm text-gray-500">
              ID Proofs: {seller.idProof?.length || 0} files uploaded
            </p>
          </div>
          <button
            onClick={() => navigate("/seller/edit-profile")}
            className="cursor-pointer w-full mt-6 py-3 rounded-lg bg-black text-white border border-black hover:bg-white hover:text-black transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default SellerFullProfile;
