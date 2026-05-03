import React from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaHome,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  const inputStyle =
    "w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed transition-all duration-300 hover:border-black hover:shadow-lg hover:scale-[1.02]";

  const labelStyle =
    "text-sm font-medium text-gray-600 flex items-center gap-2 mb-1";

  return (
    <div className="bg-gray-100 p-0 md:py-6 min-h-full flex justify-center">
      {/* Card */}
      <div
        className="bg-white p-6 pt-3 sm:p-7 lg:p-8 
                rounded-xl shadow-xl 
                w-full 
                max-w-[900px] 
                transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-1 flex items-center gap-2 ms-10 md:ms-0">
          <FaUser className="text-black" />
          Personal Information
        </h2>

        <p className="text-gray-500 text-xs sm:text-sm mb-6 ms-10 md:ms-0">
          View your personal profile information.
        </p>

        <div className="mb-4">
          <label className={labelStyle}>
            <FaUser />
            First Name
          </label>
          <input type="text" value="Denis" readOnly className={inputStyle} />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>
            <FaUser />
            Last Name
          </label>
          <input type="text" value="Holland" readOnly className={inputStyle} />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>
            <FaEnvelope />
            Email
          </label>
          <input
            type="email"
            value="denis.holland@company.com"
            readOnly
            className={inputStyle}
          />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>
            <FaPhone className="rotate-90" />
            Phone Number
          </label>
          <input
            type="text"
            value="+33 987654321"
            readOnly
            className={inputStyle}
          />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>
            <FaBirthdayCake />
            Date of Birth
          </label>
          <input
            type="date"
            value="1998-05-12"
            readOnly
            className={inputStyle}
          />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>
            <FaHome />
            Street Address
          </label>
          <input
            type="text"
            value="221B Baker Street"
            readOnly
            className={inputStyle}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelStyle}>
              <FaMapMarkerAlt />
              City
            </label>
            <input type="text" value="London" readOnly className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle}>
              <FaMapMarkerAlt />
              Postal Code
            </label>
            <input type="text" value="NW1" readOnly className={inputStyle} />
          </div>
        </div>

        <div className="mb-2">
          <label className={labelStyle}>
            <FaGlobe />
            Country
          </label>
          <input
            type="text"
            value="United Kingdom"
            readOnly
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
