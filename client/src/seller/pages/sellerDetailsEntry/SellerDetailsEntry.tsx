import {
  useEffect,
  useState,
  type JSXElementConstructor,
  type Key,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
} from "react";
import Navbar from "../sellerNavbar/SellerNavbar";
import Footer from "../sellerFooter/SellerFooter";
import toast from "react-hot-toast";
import * as IBAN from "iban";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSeller } from "../../../redux/authSlice";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaBuilding,
  FaUniversity,
  FaCreditCard,
  FaStore,
  FaRegCreditCard,
  FaGlobe,
  FaExclamationTriangle,
  FaArrowLeft,
  FaPaperPlane,
  FaArrowRight,
  FaUserCircle,
  FaUpload,
  FaTimes,
  FaIdCard,
  FaUserTie,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import axios from "axios";

const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

const inputStyle =
  "w-full border rounded-lg p-2.5 pl-10 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.01] hover:border-black";

/* ✅ Field outside (focus fix) */
const Field = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: any) => (
  <div className="relative group">
    <div className="absolute left-3 top-3 text-gray-400 transition group-hover:text-black group-focus-within:text-black">
      {icon}
    </div>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputStyle}
      readOnly={readOnly}
    />
  </div>
);

const SellerDetailsPage = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const [sellerEmail, setSellerEmail] = useState("");

  useEffect(() => {
    if (location.state?.sellerEmail) {
      // setSellerEmail(location.state.sellerEmail);
      setForm((p: any) => ({
        ...p,
        email: location.state.sellerEmail,
      }));
      // clear state
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // if no email → redirect
      navigate("/seller/signup", { replace: true });
    }
  }, []);
  const [form, setForm] = useState<any>({
    name: "",
    phone: "",
    email: "",
    address: {
      flatNoOrVillaNo: "",
      street: "",
      area: "",
      city: "",
      emirate: "",
      landmark: "",
      postalCode: "",
    },
    businessDetails: {
      bussinessName: "",
      businessEmail: "",
      bussinessPhone: "",
      whatsapp: "",
      instagram: "",
      facebook: "",
      businessAddress: {
        flatNoOrVillaNo: "",
        street: "",
        area: "",
        city: "",
        emirate: "",
        landmark: "",
        postalCode: "",
      },
    },
    bankingDetails: {
      accountHolder: "",
      accountNumber: "",
      bankName: "",
      iban: "",
      // stripeAccountId: "",
    },
    personalImage: null as File | null,
    idProof: [] as File[],
  });

  const handleChange = (e: any) => {
    setForm((p: any) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNested = (section: string, field: string, value: string) => {
    setForm((p: any) => ({
      ...p,
      [section]: { ...p[section], [field]: value },
    }));
  };

  const handleDeep = (field: string, value: string) => {
    setForm((p: any) => ({
      ...p,
      businessDetails: {
        ...p.businessDetails,
        businessAddress: {
          ...p.businessDetails.businessAddress,
          [field]: value,
        },
      },
    }));
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => /^(?:\+971|971|0)?5[0-9]{8}$/.test(v);
  const formatWhatsAppLink = (num: string) => {
    if (!num) return "";

    // remove all non-digits
    let cleaned = num.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "971" + cleaned.slice(1);
    }

    if (!cleaned.startsWith("971")) {
      return ""; // ❌ invalid non-UAE number
    }

    // ensure correct length (971 + 9 digits)
    if (cleaned.length !== 12) {
      return "";
    }

    return `https://wa.me/${cleaned}`;
  };

  const validate = () => {
    if (step === 1) {
      if (!form.name || !form.phone || !form.email)
        return "Fill all personal fields";

      if (!isEmail(form.email)) return "Invalid email";
      if (!isPhone(form.phone)) return "Invalid number";

      // ✅ FILE VALIDATION ADDED HERE
      if (!form?.personalImage) return "Upload personal image";

      if (!form?.idProof || form.idProof.length < 1)
        return "Upload ID proof image";
    }

    if (step === 2) {
      if (Object.values(form.address).some((v) => !v))
        return "Fill all address fields";
    }

    if (step === 3) {
      const b = form.businessDetails;
      const a = b.businessAddress;

      if (
        !b.bussinessName ||
        !b.businessEmail ||
        !b.bussinessPhone ||
        !b.whatsapp ||
        !b.instagram ||
        !b.facebook ||
        !a.flatNoOrVillaNo ||
        !a.street ||
        !a.area ||
        !a.city ||
        !a.emirate ||
        !a.landmark ||
        !a.postalCode
      )
        return "Fill all business fields";

      if (!isEmail(b.businessEmail)) return "Invalid business email";
      if (!isPhone(b.bussinessPhone)) return "Invalid business phone";

      // if (
      //   b.whatsapp &&
      //   !isPhone(b.whatsapp)
      // )
      //   return "Invalid WhatsApp number";
      const waLink = formatWhatsAppLink(b.whatsapp);

      if (b.whatsapp && !waLink) {
        return "Invalid WhatsApp number";
      }
      if (b.instagram && !b.instagram.includes("instagram.com"))
        return "Invalid Instagram link";

      if (b.facebook && !b.facebook.includes("facebook.com"))
        return "Invalid Facebook link";
    }

    if (step === 4) {
      const b = form.bankingDetails;

      if (Object.values(b).some((v) => !v)) return "Fill all banking fields";

      // ✅ Stripe validation
      // if (!/^acct_[a-zA-Z0-9]+$/.test(b.stripeAccountId))
      //   return "Invalid Stripe Account ID";

      // ✅ Account number validation
      // if (!/^[0-9]{9,18}$/.test(b.accountNumber))
      //   return "Invalid account number";

      // ✅ IBAN validation (real one)
      if (!IBAN.isValid(b.iban)) return "Invalid IBAN";
    }

    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err)
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
    if (!form.email) {
      navigate("/seller/signup");
      return;
    }
    const waLink = formatWhatsAppLink(form.businessDetails.whatsapp);

    // ✅ update form properly
    const updatedForm = {
      ...form,
      businessDetails: {
        ...form.businessDetails,
        whatsapp: waLink,
      },
    };

    // 👉 update state (so UI also reflects link if needed)
    setForm(updatedForm);
    const formData = new FormData();

    // 👉 append normal fields
    formData.append("updatedForm", JSON.stringify(updatedForm));

    // 👉 append files separately (VERY IMPORTANT)

    // single file
    formData.append("personalImage", updatedForm.personalImage);

    // multiple files
    updatedForm.idProof.forEach((file: string | Blob) => {
      formData.append("idProof", file);
    });

    const promise = axios.post("/api/seller/create-seller-details", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // simulate API
    const res = await toast.promise(
      promise,
      {
        loading: "Creating seller...",
        success: (res) => res?.data?.message || "Seller profile completed.",
        error: (err) =>
          err?.response?.data?.message || "Failed to create seller",
      },
      {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      },
    );

    dispatch(setSeller(res.data.seller));
    if (res.data.onboardingUrl) {
      window.location.href = res.data.onboardingUrl;
      return;
    }
    navigate("/seller/subscription");
  };

  const next = () => {
    const err = validate();
    if (err)
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
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  const steps = ["Personal", "Address", "Business", "Bank"];

  return (
    <>
      <Navbar />

      <div className=" bg-white flex justify-center md:py-10 md:px-4">
        <div className="w-full max-w-3xl border md:rounded-2xl p-3 md:p-8 shadow-md hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-5 flex items-center justify-center gap-2">
            <FaUserTie />
            Seller Profile
          </h1>

          {/* 🔥 STAGE WITH PERFECTLY ALIGNED DYNAMIC LINE */}
          <div className="relative mb-5 px-4">
            {/* base line (aligned to circle centers) */}
            <div className="absolute top-4 left-[calc(12.5%)] right-[calc(12.5%)] h-[2px] bg-gray-300 z-0" />

            {/* dynamic progress */}
            <div
              className="absolute top-4 left-[calc(12.5%)] h-[2px] bg-black z-0 transition-all duration-300"
              style={{
                width: `${((step - 1) / (steps.length - 1)) * 75}%`,
              }}
            />

            {/* steps */}
            <div className="relative flex justify-between items-center">
              {steps.map((label, i) => (
                <div key={i} className="flex flex-col items-center w-full z-10">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${
                      step > i + 1
                        ? "bg-black text-white border-black"
                        : step === i + 1
                          ? "bg-white border-black text-black"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs mt-2">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              {/* TEXT FIELDS */}
              <Field
                icon={<FaUser />}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
              />

              <Field
                icon={<FaPhone className="rotate-90 " />}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
              />

              <Field
                icon={<FaEnvelope />}
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                readOnly
              />

              <div className="flex flex-col md:flex-row gap-4">
                {/* PERSONAL IMAGE */}
                <div className="group flex-1 border border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-black hover:shadow-sm">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaUserCircle className="text-gray-500 group-hover:text-black transition" />
                    Personal Image
                  </label>

                  <label className="mt-3 text-white bg-black hover:bg-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer transition-all duration-300 hover:border-black hover:text-black hover:shadow-sm active:scale-[0.98]">
                    <FaUpload className="text-xs" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;

                        setForm((p: any) => ({
                          ...p,
                          personalImage: file,
                        }));
                      }}
                    />
                  </label>

                  {form.personalImage && (
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-300">
                      <span className="truncate">
                        {form.personalImage.name}
                      </span>

                      <button
                        onClick={() =>
                          setForm((p: any) => ({
                            ...p,
                            personalImage: null,
                          }))
                        }
                        className="text-gray-400 hover:text-black transition"
                      >
                        <FaTimes size={12} className="cursor-pointer" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ID PROOFS */}
                <div className="group flex-1 border border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-black hover:shadow-sm">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaIdCard className="text-gray-500 group-hover:text-black transition" />
                    ID Proofs (max 3)
                  </label>

                  <label className="mt-3 text-white bg-black hover:bg-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer transition-all duration-300 hover:border-black hover:text-black hover:shadow-sm active:scale-[0.98]">
                    <FaUpload className="text-xs" />
                    Upload Files
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const selected = Array.from(e.target.files || []);

                        setForm((prev: { idProof: any }) => {
                          const merged = [...(prev.idProof || []), ...selected];

                          const unique = merged.filter(
                            (file, index, self) =>
                              index ===
                              self.findIndex((f) => f.name === file.name),
                          );

                          return {
                            ...prev,
                            idProof: unique.slice(0, 3),
                          };
                        });

                        e.target.value = "";
                      }}
                    />
                  </label>

                  {form.idProof.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {form.idProof.map(
                        (
                          file: {
                            name:
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactPortal
                                  | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                          },
                          i: Key | null | undefined,
                        ) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
                          >
                            <span className="truncate">{file.name}</span>

                            <button
                              onClick={() => {
                                setForm((prev: any) => ({
                                  ...prev,
                                  idProof: prev.idProof.filter(
                                    (_: any, index: number) => index !== i,
                                  ),
                                }));
                              }}
                              className="text-gray-400 hover:text-black transition"
                            >
                              <FaTimes size={12} className="cursor-pointer" />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CONTINUE BUTTON */}
              <button
                onClick={next}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
      bg-black text-white border border-black
      transition-all duration-300
      hover:bg-white hover:text-black
      hover:scale-[1.01]
      hover:shadow-2xl
      active:scale-95
      group relative overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>
                Continue
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <Field
                icon={<FaBuilding />}
                value={form.address.flatNoOrVillaNo}
                onChange={(e: any) =>
                  handleNested("address", "flatNoOrVillaNo", e.target.value)
                }
                placeholder="Flat/Villa"
              />
              <Field
                icon={<FaMapMarkerAlt />}
                value={form.address.street}
                onChange={(e: any) =>
                  handleNested("address", "street", e.target.value)
                }
                placeholder="Street"
              />
              <Field
                icon={<FaCity />}
                value={form.address.area}
                onChange={(e: any) =>
                  handleNested("address", "area", e.target.value)
                }
                placeholder="Area"
              />
              <Field
                icon={<FaCity />}
                value={form.address.city}
                onChange={(e: any) =>
                  handleNested("address", "city", e.target.value)
                }
                placeholder="City"
              />
              <div className="relative group">
                <FaGlobe className=" absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <select
                  className={`${inputStyle} cursor-pointer`}
                  value={form.address.emirate}
                  onChange={(e) =>
                    handleNested("address", "emirate", e.target.value)
                  }
                >
                  <option value="">Select Emirate</option>
                  {emirates.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>

              <Field
                icon={<FaMapMarkerAlt />}
                value={form.address.landmark}
                onChange={(e: any) =>
                  handleNested("address", "landmark", e.target.value)
                }
                placeholder="Landmark"
              />
              <Field
                icon={<FaMapMarkerAlt />}
                value={form.address.postalCode}
                onChange={(e: any) =>
                  handleNested("address", "postalCode", e.target.value)
                }
                placeholder="Postal Code"
              />

              <div className="flex gap-3 mt-2">
                {/* BACK BUTTON */}
                <button
                  onClick={prev}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
    border border-black text-black bg-white
    transition-all duration-300
    hover:bg-black hover:text-white
    hover:scale-[1.02]
    active:scale-95
    hover:shadow-md group cursor-pointer"
                >
                  <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                  Back
                </button>

                {/* NEXT BUTTON */}
                <button
                  onClick={next}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
    bg-black text-white border border-black
    transition-all duration-300
    hover:bg-white hover:text-black
    hover:scale-[1.02]
    hover:shadow-2xl
    active:scale-95
    group relative overflow-hidden cursor-pointer"
                >
                  {/* subtle glow layer */}
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>
                  Next
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* ✅ STEP 3 FIXED */}
          {step === 3 && (
            <div className="space-y-4">
              <Field
                icon={<FaStore />}
                value={form.businessDetails.bussinessName}
                onChange={(e: any) =>
                  handleNested(
                    "businessDetails",
                    "bussinessName",
                    e.target.value,
                  )
                }
                placeholder="Business Name / Shop Name"
              />
              <Field
                icon={<FaEnvelope />}
                value={form.businessDetails.businessEmail}
                onChange={(e: any) =>
                  handleNested(
                    "businessDetails",
                    "businessEmail",
                    e.target.value,
                  )
                }
                placeholder="Business Email"
              />
              <Field
                icon={<FaPhone className="rotate-90 " />}
                value={form.businessDetails.bussinessPhone}
                onChange={(e: any) =>
                  handleNested(
                    "businessDetails",
                    "bussinessPhone",
                    e.target.value,
                  )
                }
                placeholder="Business Phone"
              />

              {/* WhatsApp Number */}
              <Field
                icon={<FaWhatsapp />}
                value={form.businessDetails.whatsapp}
                onChange={(e: any) =>
                  handleNested("businessDetails", "whatsapp", e.target.value)
                }
                placeholder="WhatsApp Number"
              />

              {/* Instagram Profile */}
              <Field
                icon={<FaInstagram />}
                value={form.businessDetails.instagram}
                onChange={(e: any) =>
                  handleNested("businessDetails", "instagram", e.target.value)
                }
                placeholder="Instagram profile link. If it’s not available, use instagram.com"
              />

              {/* Facebook Profile */}
              <Field
                icon={<FaFacebook />}
                value={form.businessDetails.facebook}
                onChange={(e: any) =>
                  handleNested("businessDetails", "facebook", e.target.value)
                }
                placeholder="Facebook Profile Link. If it’s not available, use facebook.com"
              />

              <Field
                icon={<FaBuilding />}
                value={form.businessDetails.businessAddress.flatNoOrVillaNo}
                onChange={(e: any) =>
                  handleDeep("flatNoOrVillaNo", e.target.value)
                }
                placeholder="Flat/Villa"
              />
              <Field
                icon={<FaMapMarkerAlt />}
                value={form.businessDetails.businessAddress.street}
                onChange={(e: any) => handleDeep("street", e.target.value)}
                placeholder="Street"
              />
              <Field
                icon={<FaCity />}
                value={form.businessDetails.businessAddress.area}
                onChange={(e: any) => handleDeep("area", e.target.value)}
                placeholder="Area"
              />
              <Field
                icon={<FaCity />}
                value={form.businessDetails.businessAddress.city}
                onChange={(e: any) => handleDeep("city", e.target.value)}
                placeholder="City"
              />
              <div className="relative group">
                <FaGlobe className=" absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />

                <select
                  className={`${inputStyle} cursor-pointer`}
                  value={form.businessDetails.businessAddress.emirate}
                  onChange={(e) => handleDeep("emirate", e.target.value)}
                >
                  <option value="">Select Emirate</option>
                  {emirates.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>

              <Field
                icon={<FaMapMarkerAlt />}
                value={form.businessDetails.businessAddress.landmark}
                onChange={(e: any) => handleDeep("landmark", e.target.value)}
                placeholder="Landmark"
              />
              <Field
                icon={<FaMapMarkerAlt />}
                value={form.businessDetails.businessAddress.postalCode}
                onChange={(e: any) => handleDeep("postalCode", e.target.value)}
                placeholder="Postal Code"
              />

              <div className="flex gap-3 mt-2">
                {/* BACK BUTTON */}
                <button
                  onClick={prev}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
    border border-black text-black bg-white
    transition-all duration-300
    hover:bg-black hover:text-white
    hover:scale-[1.02]
    active:scale-95
    hover:shadow-md group cursor-pointer"
                >
                  <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                  Back
                </button>

                {/* NEXT BUTTON */}
                <button
                  onClick={next}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
    bg-black text-white border border-black
    transition-all duration-300
    hover:bg-white hover:text-black
    hover:scale-[1.02]
    hover:shadow-2xl
    active:scale-95
    group relative overflow-hidden cursor-pointer"
                >
                  {/* subtle glow layer */}
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>
                  Next
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              {/* <Field
                icon={<FaCreditCard />}
                value={form.bankingDetails.stripeAccountId}
                onChange={(e: any) =>
                  handleNested(
                    "bankingDetails",
                    "stripeAccountId",
                    e.target.value,
                  )
                }
                placeholder="Stripe Account ID"
              /> */}
              <Field
                icon={<FaUser />}
                value={form.bankingDetails.accountHolder}
                onChange={(e: any) =>
                  handleNested(
                    "bankingDetails",
                    "accountHolder",
                    e.target.value,
                  )
                }
                placeholder="Account Holder"
              />

              {/* <Field
                icon={<FaRegCreditCard />}
                value={form.bankingDetails.accountNumber}
                onChange={(e: any) =>
                  handleNested(
                    "bankingDetails",
                    "accountNumber",
                    e.target.value,
                  )
                }
                placeholder="Account Number"
              /> */}
              {/* <Field
                icon={<FaUniversity />}
                value={form.bankingDetails.bankName}
                onChange={(e: any) =>
                  handleNested("bankingDetails", "bankName", e.target.value)
                }
                placeholder="Bank Name"
              /> */}
              <Field
                icon={<FaBuilding />}
                value={form.bankingDetails.iban}
                onChange={(e: any) =>
                  handleNested("bankingDetails", "iban", e.target.value)
                }
                placeholder="IBAN"
              />

              <div className="flex gap-3 mt-2">
                {/* BACK BUTTON */}
                <button
                  onClick={prev}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-black
    text-black bg-white
    transition-all duration-300
    hover:bg-black hover:text-white
    hover:scale-[1.02]
    active:scale-95
    hover:shadow-md group cursor-pointer"
                >
                  <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                  Back
                </button>

                {/* SUBMIT BUTTON */}
                <button
                  onClick={onSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
    bg-black text-white
    border border-black
    transition-all duration-300
    hover:bg-white hover:text-black
    hover:scale-[1.02]
    hover:shadow-2xl
    active:scale-95
    group relative overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>
                  <FaPaperPlane className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}
    </>
  );
};

export default SellerDetailsPage;
