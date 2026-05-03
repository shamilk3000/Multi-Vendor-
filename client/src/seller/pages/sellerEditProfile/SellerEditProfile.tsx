import { useState } from "react";
import toast from "react-hot-toast";
import * as IBAN from "iban";

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
} from "react-icons/fa";

const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

const initialData = {
  name: "Ayaan Mohammed",
  phone: "+971501234567",
  sellerEmail: "ayaan@example.com",

  address: {
    flatNoOrVillaNo: "Villa 12",
    street: "Palm Street",
    area: "Al Barsha",
    city: "Dubai",
    emirate: "Dubai",
    landmark: "Near Mall",
    postalCode: "00000",
  },

  businessDetails: {
    bussinessName: "Ayaan Traders",
    businessEmail: "business@ayaan.com",
    bussinessPhone: "+971502223334",

    businessAddress: {
      flatNoOrVillaNo: "Shop 5",
      street: "Market Road",
      area: "Deira",
      city: "Dubai",
      emirate: "Dubai",
      landmark: "Gold Souk",
      postalCode: "11111",
    },
  },

  bankingDetails: {
    accountHolder: "Ayaan Mohammed",
    accountNumber: "123456789012",
    bankName: "Emirates NBD",
    iban: "AE070331234567890123456",
    stripeAccountId: "acct_123456789",
  },
};

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
  const [form, setForm] = useState(initialData);

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
    if (!form.name || !form.phone || !form.sellerEmail)
      return "Fill all personal fields";

    if (!isEmail(form.sellerEmail)) return "Invalid email";
    if (!isPhone(form.phone)) return "Invalid phone number";

    // ADDRESS
    if (Object.values(form.address).some((v) => !v))
      return "Fill all address fields";

    // BUSINESS
    const b = form.businessDetails;
    const a = b.businessAddress;

    if (!b.bussinessName || !b.businessEmail || !b.bussinessPhone) {
      return "Fill all business basic fields";
    }

    if (!isEmail(b.businessEmail)) return "Invalid business email";
    if (!isPhone(b.bussinessPhone)) return "Invalid business phone";

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

    // BANK
    const bank = form.bankingDetails;

    if (Object.values(bank).some((v) => !v)) return "Fill all banking fields";

    if (!/^acct_[a-zA-Z0-9]+$/.test(bank.stripeAccountId))
      return "Invalid Stripe Account ID";

    if (!/^[0-9]{9,18}$/.test(bank.accountNumber))
      return "Invalid account number";

    if (!IBAN.isValid(bank.iban)) return "Invalid IBAN";

    return null;
  };

  const handleSubmit = () => {
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

    console.log("Updated Seller Data:", form);

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
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
  };

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
            value={form.sellerEmail}
            readOnly
            // onChange={(e: any) => handleChange(["sellerEmail"], e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="border p-4 rounded-xl mb-4 bg-white hover:shadow-2xl">
          <h2 className="font-semibold mb-3">Address</h2>

          {Object.keys(form.address).map((key) =>
            key === "emirate" ? (
              <div key={key} className="mb-3">
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
            ) : (
              <Input
                key={key}
                label={key}
                icon={<FaMapMarkerAlt />}
                value={(form.address as any)[key]}
                onChange={(e: any) =>
                  handleChange(["address", key], e.target.value)
                }
              />
            ),
          )}
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
            value={form.bankingDetails.accountHolder}
            onChange={(e: any) =>
              handleChange(["bankingDetails", "accountHolder"], e.target.value)
            }
          />
          <Input
            label="Account Number"
            icon={<FaCreditCard />}
            value={form.bankingDetails.accountNumber}
            readOnly
            // onChange={(e: any) =>
            //   handleChange(["bankingDetails", "accountNumber"], e.target.value)
            // }
          />
          <Input
            label="Bank Name"
            icon={<FaUniversity />}
            value={form.bankingDetails.bankName}
            readOnly
            // onChange={(e: any) =>
            //   handleChange(["bankingDetails", "bankName"], e.target.value)
            // }
          />
          <Input
            label="IBAN"
            icon={<FaCreditCard />}
            value={form.bankingDetails.iban}
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

      {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}
    </>
  );
};

export default SellerEditPage;
