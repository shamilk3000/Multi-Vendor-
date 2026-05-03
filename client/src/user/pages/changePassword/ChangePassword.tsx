import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaEdit,
} from "react-icons/fa";

const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [showNewPassSuccess, setShowNewPassSuccess] = useState(true);
  const [showConfirmPassSuccess, setShowConfirmPassSuccess] = useState(true);

  const minLengthValid = newPassword.length >= 6;
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsNotMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  // hide green success for password length
  useEffect(() => {
    if (minLengthValid) {
      setShowNewPassSuccess(true);
      const timer = setTimeout(() => setShowNewPassSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [minLengthValid]);

  // hide green success for password match
  useEffect(() => {
    if (passwordsMatch) {
      setShowConfirmPassSuccess(true);
      const timer = setTimeout(() => setShowConfirmPassSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordsMatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minLengthValid) return alert("Password must be at least 6 characters");
    if (!passwordsMatch) return alert("Passwords do not match");

    alert("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inputStyle =
    "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

  return (
    <div className="py-20 bg-gray-100 md:flex md:items-center md:justify-center md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="
  w-full 
  md:max-w-lg 
  bg-white 
  p-10 md:p-6 
  md:rounded-3xl 
  md:shadow-lg 
  md:border md:border-gray-200 
  md:overflow-y-auto
"
        style={{ maxHeight: "90vh" }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center text-black flex items-center justify-center gap-2 group hover:animate-[wave_0.5s_ease-in-out]">
          <FaLock className="text-black" size={25} />
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* NEW PASSWORD */}
          <div className=" group hover:animate-[wave_0.5s_ease-in-out] ">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              New Password
            </label>
            <div className="relative group mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />

              <input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-3.5 text-gray-500 cursor-pointer "
              >
                {showNewPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <AnimatePresence>
              {newPassword.length > 0 && (
                <>
                  {!minLengthValid && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <FaTimesCircle />
                      Password must be at least 6 characters
                    </motion.p>
                  )}
                  {minLengthValid && showNewPassSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <FaCheckCircle />
                      Password length is valid
                    </motion.p>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className=" group hover:animate-[wave_0.5s_ease-in-out] ">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative group mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />

              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-3.5 text-gray-500 cursor-pointer "
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <AnimatePresence>
              {confirmPassword.length > 0 && (
                <>
                  {/* Red warning */}
                  {passwordsNotMatch && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <FaTimesCircle />
                      Passwords do not match
                    </motion.p>
                  )}

                  {/* Green success */}
                  {passwordsMatch && showConfirmPassSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <FaCheckCircle />
                      Passwords match
                    </motion.p>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={!(minLengthValid && passwordsMatch)}
            className={`w-full py-3 flex flex-row justify-center gap-2  sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition ${
              minLengthValid && passwordsMatch
                ? "bg-black text-white shadow-md cursor-pointer "
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="my-auto">
              <FaEdit />
            </div>
            Update Password
          </motion.button>
        </form>
      </motion.div>
      {/* Wave animation */}
      <style>
        {`
          @keyframes wave {
            0%   { transform: translateY(0); }
            25%  { transform: translateY(-4px); }
            50%  { transform: translateY(4px); }
            75%  { transform: translateY(-2px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ChangePassword;
