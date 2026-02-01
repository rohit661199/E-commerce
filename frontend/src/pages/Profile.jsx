import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import { serverUrl } from "../App";
import upload_icon from "../assets/upload_icon.png";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [editData, setEditData] = useState(userData);

  useEffect(() => {
    if (userData) setEditData(userData);
  }, [userData]);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("phone", editData.phone);
      formData.append("address", JSON.stringify(editData.address));
      formData.append("gender", editData.gender);
      formData.append("dob", editData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${serverUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserData(data.user));
        setIsEdit(false);
        setImage(false);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const inputStyles =
    "bg-white/70 backdrop-blur-md border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary block w-full p-3 outline-none transition-all duration-200 hover:border-gray-300";

  return (
    userData && (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/10 flex justify-center px-4 py-12 mt-16">
        <div className="w-full max-w-2xl rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden">

          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/10" />

          <div className="px-8 pb-10">
            {/* Header */}
            <div className="relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-10">
              <div className="group relative">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer block">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                      <img
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition-all"
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt="profile"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img src={upload_icon} className="w-8 opacity-90" />
                      </div>
                    </div>
                    <input
                      hidden
                      type="file"
                      id="image"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                ) : (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      className="w-full h-full object-cover"
                      src={userData.image}
                      alt="profile"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                {isEdit ? (
                  <input
                    value={editData?.name || ""}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="text-3xl font-extrabold bg-transparent border-b-2 border-primary/60 focus:border-primary outline-none px-1 w-full max-w-xs tracking-tight transition-all"
                  />
                ) : (
                  <h2 className="text-3xl font-extrabold text-gray-800">
                    {userData.name}
                  </h2>
                )}
                <p className="text-primary font-medium">{userData.email}</p>
              </div>
            </div>

            <hr className="border-gray-100 mb-10" />

            {/* Sections */}
            <div className="space-y-10">
              {/* Contact Info */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-1 w-8 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5 items-center">
                  <p className="text-sm font-semibold text-gray-500">
                    Phone Number
                  </p>
                  {isEdit ? (
                    <input
                      className={inputStyles}
                      value={editData?.phone || ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {userData.phone}
                    </p>
                  )}

                  <p className="text-sm font-semibold text-gray-500">
                    Address
                  </p>
                  {isEdit ? (
                    <div className="space-y-3">
                      <input
                        className={inputStyles}
                        placeholder="Street line 1"
                        value={editData?.address?.line1 || ""}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            address: { ...p.address, line1: e.target.value },
                          }))
                        }
                      />
                      <input
                        className={inputStyles}
                        placeholder="Street line 2"
                        value={editData?.address?.line2 || ""}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            address: { ...p.address, line2: e.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {userData.address?.line1}
                      <br />
                      {userData.address?.line2}
                    </p>
                  )}
                </div>
              </section>

              {/* Basic Info */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-1 w-8 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5 items-center">
                  <p className="text-sm font-semibold text-gray-500">Gender</p>
                  {isEdit ? (
                    <select
                      className={`${inputStyles} max-w-[160px]`}
                      value={editData?.gender || ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, gender: e.target.value }))
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {userData.gender}
                    </p>
                  )}

                  <p className="text-sm font-semibold text-gray-500">
                    Date of Birth
                  </p>
                  {isEdit ? (
                    <input
                      type="date"
                      className={`${inputStyles} max-w-[200px]`}
                      value={editData?.dob || ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, dob: e.target.value }))
                      }
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {userData.dob}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="mt-14 flex justify-center sm:justify-end">
             {isEdit ? (
  <button
    onClick={updateUserProfileData}
    className="w-full sm:w-auto 
    bg-primary 
    text-black 
    font-bold 
    px-10 py-3 
    rounded-xl 
    shadow-lg 
    hover:shadow-xl 
    active:scale-95 
    transition-all duration-200"
  >
    Save Changes
  </button>
) : (
  <button
    onClick={() => setIsEdit(true)}
    className="w-full sm:w-auto 
    bg-white 
    border-2 border-primary 
    text-primary 
    font-bold 
    px-10 py-3 
    rounded-xl 
    shadow-md 
    hover:shadow-xl 
   
    active:scale-95 
    transition-all duration-200"
  >
    Edit Profile
  </button>
)}

            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
