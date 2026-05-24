import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaGlobe,
  FaCity,
  FaUserTie,
} from "react-icons/fa";
import { useUserProfile } from "../../../hooks/user/profile/useProfile";
import ProfileSkeleton from "../../components/skeletons/profile";

const Dashboard: React.FC = () => {
  const { data: userdata, isLoading } = useUserProfile();
  const user = userdata?.userProfile;
  console.log(user);

  const Row = ({ icon, label, value }: any) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-none">
      <div className="text-gray-500 mt-1 text-sm">{icon}</div>

      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>

        <p className="text-sm md:text-base font-medium text-black wrap-break-word">
          {value || "-"}
        </p>
      </div>
    </div>
  );
  
if (isLoading) {
  return <ProfileSkeleton />;
}
  return (
    <div className="flex justify-center">
      <div className="w-full rounded-2xl border shadow-md p-6 md:p-10 bg-white">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
            {user.name.charAt(0)}
          </div>

          <h1 className="text-2xl font-bold mt-3 flex items-center justify-center gap-2">
            <FaUserTie />
            {user.name}
          </h1>

          <p className="text-gray-500 text-sm">
            Personal Information Dashboard
          </p>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="border rounded-xl p-5 mb-5 bg-white hover:shadow-2xl transition">
          <h2 className="font-semibold mb-3 text-lg">Personal Details</h2>

          <Row icon={<FaUser />} label="First Name" value={user.name} />

          <Row icon={<FaEnvelope />} label="Email" value={user.email} />

          <Row
            icon={<FaPhone className="rotate-90" />}
            label="Phone Number"
            value={user.address.phone}
          />
        </div>

        {/* ADDRESS */}
        <div className="border rounded-xl p-5 bg-white hover:shadow-2xl transition">
          <h2 className="font-semibold mb-3 text-lg">Address Details</h2>

          <Row
            icon={<FaHome />}
            label="Flat / Villa No"
            value={user.address.flatNoOrVillaNo}
          />

          <Row
            icon={<FaMapMarkerAlt />}
            label="Street"
            value={user.address.street}
          />

          <Row icon={<FaCity />} label="Area" value={user.address.area} />

          <Row icon={<FaCity />} label="City" value={user.address.city} />

          <Row
            icon={<FaGlobe />}
            label="Emirate"
            value={user.address.emirate}
          />

          <Row
            icon={<FaMapMarkerAlt />}
            label="Landmark"
            value={user.address.landmark}
          />

          <Row
            icon={<FaMapMarkerAlt />}
            label="Postal Code"
            value={user.address.postalCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
