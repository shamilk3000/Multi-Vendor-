import { useState } from "react";
import toast from "react-hot-toast";
import * as IBAN from "iban";
import { useSellerProfile } from "../../../hooks/seller/profile/useProfile";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStore,
  FaMapMarkerAlt,
  FaCreditCard,
  FaUniversity,
  FaExclamationTriangle,
  FaGlobe,
  FaEdit,
  FaRegCreditCard,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SellerEditProfileSkeleton from "@/seller/components/skeletons/editProfileSkeleton";
import { ultrateUpdateProfile } from "../../../hooks/seller/profile/ultrateProfile";

const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

const Input = ({ label, value, onChange, icon, readOnly }: any) => (
  <div className="mb-3">
    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
      {icon} {label}
    </p>

    <input
      value={value ?? ""}
      onChange={onChange || (() => {})}
      readOnly={readOnly}
      className={`w-full border text-sm p-2 rounded-lg transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-black hover:border hover:border-black ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^(?:\+971|971|0)?5[0-9]{8}$/.test(v);

const SellerEditPage = () => {
  const { data: seller, isLoading } = useSellerProfile();
  const { mutateAsync: updateProfile } = ultrateUpdateProfile();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    ...seller,
    businessDetails: {
      ...seller.businessDetails,
      bussinessWhatsapp: seller.businessDetails.bussinessWhatsapp.replace(
        "https://wa.me/",
        "",
      ),
    },
  });

  const handleChange = (path: string[], value: string) => {
    setForm((prev: any) => {
      const copy = { ...prev };
      let obj = copy;

      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }

      obj[path[path.length - 1]] = value;
      return { ...copy };
    });
  };

  const validate = () => {
    if (!form.name || !form.phone || !form.email)
      return "Fill all personal fields";

    if (!isEmail(form.email)) return "Invalid email";
    if (!isPhone(form.phone)) return "Invalid phone number";

    // ADDRESS
    const {
      flatNoOrVillaNo,
      street,
      area,
      city,
      emirate,
      landmark,
      postalCode,
    } = form.address;
    if (
      !flatNoOrVillaNo ||
      !street ||
      !area ||
      !city ||
      !emirate ||
      !landmark ||
      !postalCode
    ) {
      return "Fill all address fields";
    }

    // BUSINESS
    const b = form.businessDetails;
    const a = b.businessAddress;

    if (
      !b.bussinessName ||
      !b.businessEmail ||
      !b.bussinessPhone ||
      !b.bussinessWhatsapp ||
      !b.bussinessInstagram ||
      !b.bussinessFacebook
    ) {
      return "Fill all business basic fields";
    }

    if (!isEmail(b.businessEmail)) return "Invalid business email";
    if (!isPhone(b.bussinessPhone)) return "Invalid business phone";
    if (b.bussinessInstagram && !b.bussinessInstagram.includes("instagram.com"))
      return "Invalid Instagram link";

    if (b.bussinessFacebook && !b.bussinessFacebook.includes("facebook.com"))
      return "Invalid Facebook link";

    // BUSINESS ADDRESS (FULL CHECK)
    if (
      !a.flatNoOrVillaNo ||
      !a.street ||
      !a.area ||
      !a.city ||
      !a.emirate ||
      !a.landmark ||
      !a.postalCode
    ) {
      return "Fill all business address fields";
    }

    return null;
  };

  const handleSubmit = async () => {
    const err = validate();

    if (err) {
      return toast.error(err, {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
    }
    const formattedData = {
      ...form,
      businessDetails: {
        ...form.businessDetails,
        bussinessWhatsapp: `https://wa.me/${form.businessDetails.bussinessWhatsapp}`,
      },
    };

    try {
      await toast.promise(
        updateProfile(formattedData),
        {
          loading: "Updating profile...",
          success: "Profile updated successfully",
          error: "Failed to update seller",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );

      navigate("/seller/profile");
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  if (isLoading) {
    return <SellerEditProfileSkeleton />;
  }

  return (
    <>
      <div className="w-full border p-4 md:p-10">
        <div className="flex flex-row gap-2 ms-11 md:ms-0 pb-4 items-center">
          <FaEdit size={20} />
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        {/* PERSONAL */}
        <div className="border p-4 rounded-xl mb-4 bg-white hover:shadow-2xl">
          <h2 className="font-semibold mb-3">Personal</h2>

          <Input
            label="Name"
            icon={<FaUser />}
            value={form.name}
            readOnly
            // onChange={(e: any) => handleChange(["name"], e.target.value)}
          />

          <Input
            label="Phone"
            icon={<FaPhone className="rotate-90 " />}
            value={form.phone}
            onChange={(e: any) => handleChange(["phone"], e.target.value)}
          />

          <Input
            label="Email"
            icon={<FaEnvelope />}
            value={form.email}
            readOnly
            // onChange={(e: any) => handleChange(["email"], e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="border p-4 rounded-xl mb-4 bg-white hover:shadow-2xl">
          <h2 className="font-semibold mb-3">Address</h2>
          <Input
            label="Flat / Villa No"
            icon={<FaMapMarkerAlt />}
            value={form.address.flatNoOrVillaNo}
            onChange={(e: any) =>
              handleChange(["address", "flatNoOrVillaNo"], e.target.value)
            }
          />

          <Input
            label="Street"
            icon={<FaMapMarkerAlt />}
            value={form.address.street}
            onChange={(e: any) =>
              handleChange(["address", "street"], e.target.value)
            }
          />

          <Input
            label="Area"
            icon={<FaMapMarkerAlt />}
            value={form.address.area}
            onChange={(e: any) =>
              handleChange(["address", "area"], e.target.value)
            }
          />

          <Input
            label="City"
            icon={<FaMapMarkerAlt />}
            value={form.address.city}
            onChange={(e: any) =>
              handleChange(["address", "city"], e.target.value)
            }
          />

          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FaGlobe /> Emirate
            </p>

            <select
              value={form.address.emirate}
              onChange={(e) =>
                handleChange(["address", "emirate"], e.target.value)
              }
              className="w-full border p-2 rounded-lg cursor-pointer"
            >
              <option value="">Select Emirate</option>

              {emirates.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>

          <Input
            label="Landmark"
            icon={<FaMapMarkerAlt />}
            value={form.address.landmark}
            onChange={(e: any) =>
              handleChange(["address", "landmark"], e.target.value)
            }
          />

          <Input
            label="Postal Code"
            icon={<FaMapMarkerAlt />}
            value={form.address.postalCode}
            onChange={(e: any) =>
              handleChange(["address", "postalCode"], e.target.value)
            }
          />
        </div>

        {/* BUSINESS */}
        <div className="border p-4 rounded-xl mb-4 bg-white hover:shadow-2xl">
          <h2 className="font-semibold mb-3">Business</h2>

          <Input
            label="Business Name"
            icon={<FaStore />}
            value={form.businessDetails.bussinessName}
            onChange={(e: any) =>
              handleChange(["businessDetails", "bussinessName"], e.target.value)
            }
          />

          <Input
            label="Business Email"
            icon={<FaEnvelope />}
            value={form.businessDetails.businessEmail}
            onChange={(e: any) =>
              handleChange(["businessDetails", "businessEmail"], e.target.value)
            }
          />

          <Input
            label="Business Phone"
            icon={<FaPhone className="rotate-90" />}
            value={form.businessDetails.bussinessPhone}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "bussinessPhone"],
                e.target.value,
              )
            }
          />

          <Input
            label="Business WhatsApp"
            icon={<FaWhatsapp />}
            value={form.businessDetails.bussinessWhatsapp}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "bussinessWhatsapp"],
                e.target.value,
              )
            }
          />

          <Input
            label="Business Instagram"
            icon={<FaInstagram />}
            value={form.businessDetails.bussinessInstagram}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "bussinessInstagram"],
                e.target.value,
              )
            }
          />

          <Input
            label="Business Facebook"
            icon={<FaFacebook />}
            value={form.businessDetails.bussinessFacebook}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "bussinessFacebook"],
                e.target.value,
              )
            }
          />

          <h3 className="mt-4 mb-2 font-medium text-sm text-gray-500">
            Business Address
          </h3>

          <Input
            label="Flat / Villa No"
            icon={<FaMapMarkerAlt />}
            value={form.businessDetails.businessAddress.flatNoOrVillaNo}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "businessAddress", "flatNoOrVillaNo"],
                e.target.value,
              )
            }
          />

          <Input
            label="Street"
            icon={<FaMapMarkerAlt />}
            value={form.businessDetails.businessAddress.street}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "businessAddress", "street"],
                e.target.value,
              )
            }
          />

          <Input
            label="Area"
            icon={<FaMapMarkerAlt />}
            value={form.businessDetails.businessAddress.area}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "businessAddress", "area"],
                e.target.value,
              )
            }
          />

          <Input
            label="City"
            icon={<FaMapMarkerAlt />}
            value={form.businessDetails.businessAddress.city}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "businessAddress", "city"],
                e.target.value,
              )
            }
          />

          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FaGlobe /> Business Emirate
            </p>
            <select
              value={form.businessDetails.businessAddress.emirate}
              onChange={(e) =>
                handleChange(
                  ["businessDetails", "businessAddress", "emirate"],
                  e.target.value,
                )
              }
              className="w-full border p-2 rounded-lg cursor-pointer"
            >
              <option value="">Select Emirate</option>
              {emirates.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>

          <Input
            label="Landmark"
            icon={<FaMapMarkerAlt />}
            value={form.businessDetails.businessAddress.landmark}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "businessAddress", "landmark"],
                e.target.value,
              )
            }
          />

          <Input
            label="Postal Code"
            icon={<FaMapMarkerAlt />}
            value={form.businessDetails.businessAddress.postalCode}
            onChange={(e: any) =>
              handleChange(
                ["businessDetails", "businessAddress", "postalCode"],
                e.target.value,
              )
            }
          />
        </div>

        {/* BANK */}
        <div className="border p-4 rounded-xl mb-4 bg-white hover:shadow-2xl">
          <h2 className="font-semibold mb-3">Banking</h2>
          <Input
            label="Account Holder"
            icon={<FaUser />}
            value={form.bankingDetails.accountHolderName}
            readOnly
            // onChange={(e: any) =>
            //   handleChange(["bankingDetails", "accountHolder"], e.target.value)
            // }
          />
          {/* <Input
            label="Account Number"
            icon={<FaCreditCard />}
            value={form.bankingDetails.accountNumber}
            readOnly
            onChange={(e: any) =>
              handleChange(["bankingDetails", "accountNumber"], e.target.value)
            }
          /> */}
          {/* <Input
            label="Bank Name"
            icon={<FaUniversity />}
            value={form.bankingDetails.bankName}
            readOnly
            onChange={(e: any) =>
              handleChange(["bankingDetails", "bankName"], e.target.value)
            }
          /> */}
          <Input
            label="IBAN"
            icon={<FaCreditCard />}
            value={form.bankingDetails.IBANnumber}
            readOnly
            // onChange={(e: any) =>
            //   handleChange(["bankingDetails", "iban"], e.target.value)
            // }
          />{" "}
          <Input
            label="Strip AccountId"
            icon={<FaRegCreditCard />}
            value={form.bankingDetails.stripeAccountId}
            readOnly
            // onChange={(e: any) =>
            //   handleChange(["bankingDetails", "iban"], e.target.value)
            // }
          />
        </div>

        {/* SAVE */}
        <button
          onClick={handleSubmit}
          className="cursor-pointer w-full py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition"
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default SellerEditPage;
