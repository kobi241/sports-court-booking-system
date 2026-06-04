import styles from "./UserProfileModal.module.css";

function UserProfileModal({ userProfile, handleCloseUserProfile }) {
  if (!userProfile) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleCloseUserProfile}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleCloseUserProfile}
        >
          ×
        </button>

        <div className={styles.header}>
          {userProfile.profile_image ? (
            <img
              className={styles.avatar}
              src={userProfile.profile_image}
              alt="User profile"
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {userProfile.first_name.charAt(0)}
              {userProfile.last_name.charAt(0)}
            </div>
          )}

          <h2>
            {userProfile.first_name} {userProfile.last_name}
          </h2>

          <p>{userProfile.email}</p>
          <span className={styles.role}>{userProfile.role}</span>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.label}>Phone</p>
          <strong>{userProfile.phone_number || "Not added yet"}</strong>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.label}>Bio</p>
          <p>{userProfile.bio || "Not added yet"}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfileModal;
