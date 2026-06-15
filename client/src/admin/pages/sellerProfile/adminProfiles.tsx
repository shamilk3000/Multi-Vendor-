import Navbar from "../navbar/adminNavbar";
import Footer from "../../../seller/pages/sellerFooter/SellerFooter";
import { useAdminProfile } from "../../../hooks/admin/profile/useProfile";
import { ultrateAmount } from "../../../hooks/admin/profile/ultrateProfile";
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaStore,
  FaMapMarkerAlt,
  FaClock,
  FaCreditCard,
  FaLandmark,
  FaUniversity,
  FaUser,
  FaWallet,
  FaSearch,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SellerProfilesSkeleton from "@/admin/components/skeletons/admineProfilesSkeleton";
type Seller = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  accountStatus?: string;
  wallet?: {
    creditedAmount?: number;
    stripeFee?: number;
    total?: number;
  };
  businessDetails?: {
    bussinessName?: string;
  };
  bankingDetails?: {
    IBANnumber?: string;
    bankName?: string;
  };
};

const SellerProfilesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const { mutateAsync: updateAmount } = ultrateAmount();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (!location.state?.admin) {
      navigate("/admin", { replace: true });
    }
    // if (location.state?.sellerEmail) {
    //   // clear state
    //   navigate(location.pathname, { replace: true, state: {} });
    // } else {
    //   // if no email → redirect
    //   navigate("/seller/signup", { replace: true });
    // }
  }, [location, navigate]);
  const { data: sellers, isLoading } = useAdminProfile({
    email: location.state?.admin,
  });
  console.log(sellers);
  console.log(location.state?.admin);

  const paySellerAmount = async (sellerId: string) => {
    try {
      await toast.promise(
        updateAmount({
          sellerId,
          email: location.state?.admin,
        }),
        {
          loading: `Updating the wallet...`,
          success: `Wallet updated ✅`,
          error: "Update failed ❌",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
          duration: 3500,
        },
      );
    } catch (error) {
      throw error;
    }
  };

  const filteredSellers = sellers?.filter((seller: Seller) => {
    const keyword = search.toLowerCase();

    return (
      seller.name?.toLowerCase().includes(keyword) ||
      seller.email?.toLowerCase().includes(keyword) ||
      seller.phone?.toLowerCase().includes(keyword) ||
      seller.businessDetails?.bussinessName?.toLowerCase().includes(keyword)
    );
  });

  const sortedSellers = [...(filteredSellers || [])].sort((a, b) => {
    return (b.wallet?.creditedAmount || 0) - (a.wallet?.creditedAmount || 0);
  });

  if (isLoading || !sellers) return <SellerProfilesSkeleton />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
            <FaUserTie />
            Seller Profiles
          </h1>
          {/* SEARCH */}
          <div className="relative mb-2 transition-all duration-300 hover:scale-[1.01]">
            <FaSearch className="absolute left-3 top-3 text-gray-700" />
            <input
              placeholder="Search sellers by business,name,email,phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  rounded-lg pl-9 p-2 text-sm focus:ring-2 focus:ring-black border border-gray-500 "
            />
          </div>
          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSellers.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-3">😕</div>

                <h2 className="text-lg font-semibold text-gray-800">
                  No sellers found
                </h2>
                <p className="text-sm text-gray-500 mt-1">OR</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search
                </p>

                <button
                  onClick={() => setSearch("")}
                  className="mt-4 px-4 py-2 text-sm rounded-lg border border-gray-400 text-gray-700 hover:bg-black hover:text-white transition"
                >
                  Clear Search
                </button>
              </div>
            )}
            {sortedSellers?.map((seller: any) => (
              <div
                key={seller._id}
                className="border rounded-2xl p-5 shadow-sm hover:shadow-2xl transition bg-white"
              >
                <div className="flex items-center justify-between">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full text-lg">
                      {seller.name?.charAt(0)}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">{seller.name}</h2>
                      <p className="text-xs text-gray-500">Seller Account</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        seller.accountStatus === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {seller.accountStatus}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="mt-4 space-y-2 text-sm text-black">
                  <p className="flex items-center gap-2 font-medium">
                    <FaStore className="text-black" />
                    <span className="font-semibold">Business:</span>{" "}
                    {seller.businessDetails?.bussinessName}
                  </p>

                  <p className="flex items-center gap-2 font-medium">
                    <FaEnvelope className="text-black" />
                    <span className="font-semibold">Email:</span> {seller.email}
                  </p>

                  <p className="flex items-center gap-2 font-medium ">
                    <FaPhone className="text-black rotate-90 " />
                    <span className="font-semibold">Phone:</span> {seller.phone}
                  </p>

                  <p className="flex items-center gap-2 font-medium">
                    <FaClock className="text-black" />
                    <span className="font-semibold">Expires:</span>{" "}
                    {seller.subscriptionExpiry
                      ? new Date(seller.subscriptionExpiry).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </p>

                  {/* Wallet */}
                  <div className="mt-3 p-3 bg-gray-200 rounded-lg">
                    <p className="flex items-center gap-2 font-bold text-xs mb-2 text-black">
                      <FaWallet className="text-black" />
                      Wallet Details
                    </p>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-black font-medium">
                          Credited:
                        </span>
                        <span className="text-black font-medium">
                          {seller.wallet?.creditedAmount}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-black font-medium">
                          Stripe Fee:
                        </span>
                        <span className="text-black font-medium">
                          {seller.wallet?.stripeFee}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-black font-medium">Total:</span>
                        <span className="text-black font-medium">
                          {seller.wallet?.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Banking */}
                  <div className="p-3 bg-gray-200 rounded-lg space-y-1">
                    <p className="flex items-center gap-2 font-bold text-xs mb-2 text-black ">
                      <FaUniversity className="text-black font-e" />
                      Banking Details
                    </p>

                    <p className="text-xs text-black font-medium">
                      <FaUser className="inline mr-1 text-black" />
                      {seller.bankingDetails?.accountHolderName}
                    </p>

                    <p className="text-xs text-black font-medium">
                      <FaLandmark className="inline mr-1 text-black" />
                      {seller.bankingDetails?.bankName}
                    </p>

                    <p className="text-xs text-black font-medium">
                      <FaCreditCard className="inline mr-1 text-black" />
                      {seller.bankingDetails?.IBANnumber}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  disabled={
                    seller.wallet?.creditedAmount === 0 ||
                    seller.accountStatus === "PENDING_PAYMENT"
                  }
                  onClick={() => {
                    if (
                      seller.wallet?.creditedAmount === 0 ||
                      seller.accountStatus === "PENDING_PAYMENT"
                    )
                      return;

                    setSelectedSeller(seller);
                    setShowModal(true);
                  }}
                  className={`mt-4 w-full py-2 rounded-lg border transition font-medium ${
                    seller.wallet?.creditedAmount === 0 ||
                    seller.accountStatus === "PENDING_PAYMENT"
                      ? "bg-gray-300 texsellert-gray-600 border-gray-300 cursor-not-allowed"
                      : "bg-black text-white border-black hover:bg-white hover:text-black cursor-pointer"
                  }`}
                >
                  Pay Credited Amount
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2 ">Confirm Payment</h2>

            <p className="text-sm text-black mb-2 space-y-1">
              Pay credited amount to <b>{selectedSeller?.name} </b>?{" "}
            </p>
            <span className="space-y-1 text-sm">
              <p className="font-bold">
                Bussiness :{" "}
                <span className="font-bold text-xs">
                  {selectedSeller?.businessDetails?.bussinessName}{" "}
                </span>
              </p>
              <p className="font-bold">
                Email :{" "}
                <span className="font-bold text-xs">
                  {selectedSeller?.email}{" "}
                </span>
              </p>
              <p className="font-bold">
                IBAN :{" "}
                <span className="font-bold text-xs">
                  {selectedSeller?.bankingDetails?.IBANnumber}{" "}
                </span>
              </p>
              <p className="font-bold">
                Bank Name :{" "}
                <span className="font-bold text-xs">
                  {selectedSeller?.bankingDetails?.bankName}{" "}
                </span>
              </p>
            </span>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-200 text-black font-medium border-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await paySellerAmount(selectedSeller?._id); // 👈 OUTSIDE API CALL

                    console.log("Payment success");
                    setShowModal(false);
                  } catch (err) {
                    console.log("Payment failed", err);
                  }
                }}
                className="px-4 py-2 text-sm bg-black text-white border border-black hover:bg-white hover:text-black rounded-lg font-medium"
              >
                OK Pay
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SellerProfilesPage;
