import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

import styles from "./ProfilePage.module.css";

const emptyProfileForm = {
  phone_number: "",
  bio: "",
  profile_image: "",
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await getProfile();

    setProfile(data);
    setProfileForm({
      phone_number: data.phone_number || "",
      bio: data.bio || "",
      profile_image: data.profile_image || "",
    });
  };

  const handleChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const result = await updateProfile(profileForm);

    if (result.message !== "Profile updated successfully") {
      alert(result.message || "Profile could not be updated");
      return;
    }

    await loadProfile();
    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setProfileForm({
      phone_number: profile.phone_number || "",
      bio: profile.bio || "",
      profile_image: profile.profile_image || "",
    });
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.card}>
        <div className={styles.profileHeader}>
          {profile.profile_image ? (
            <img
              className={styles.avatar}
              src={profile.profile_image}
              alt="Profile"
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {profile.first_name.charAt(0)}
              {profile.last_name.charAt(0)}
            </div>
          )}

          <div>
            <h2>
              {profile.first_name} {profile.last_name}
            </h2>
            <p>{profile.email}</p>
            <span className={styles.role}>{profile.role}</span>
          </div>
        </div>

        {isEditing ? (
          <form className={styles.form} onSubmit={handleUpdateProfile}>
            <input
              name="phone_number"
              value={profileForm.phone_number}
              onChange={handleChange}
              placeholder="Phone number"
              className={styles.input}
            />

            <input
              name="profile_image"
              value={profileForm.profile_image}
              onChange={handleChange}
              placeholder="Profile image URL"
              className={styles.input}
            />

            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleChange}
              placeholder="Short bio"
              className={styles.input}
            />

            <div className={styles.actions}>
              <button type="submit" className={styles.button}>
                Save Changes
              </button>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.info}>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <p className={styles.label}>Phone</p>

                <strong>{profile.phone_number || "Not added yet"}</strong>
              </div>

              <div className={styles.infoBox}>
                <p className={styles.label}>Bio</p>

                <p>{profile.bio || "Not added yet"}</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.button}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
