function Toast({ message, type = "info", onClose }) {
  const getToastStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-100",
          border: "border-red-200",
          text: "text-red-800",
          icon: "fa-solid fa-exclamation-triangle",
          iconBg: "bg-red-500"
        };
      case "success":
        return {
          bg: "bg-green-100",
          border: "border-green-200",
          text: "text-green-800",
          icon: "fa-solid fa-check-circle",
          iconBg: "bg-green-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: "fa-solid fa-exclamation-circle",
          iconBg: "bg-yellow-500"
        };
      default:
        return {
          bg: "bg-gray-100",
          border: "border-gray-200",
          text: "text-gray-800",
          icon: "fa-regular fa-bell",
          iconBg: "bg-[#264533]"
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`flex items-center w-full max-w-xs p-4 rounded-lg shadow-sm fixed bottom-5 right-5 z-50 border ${styles.bg} ${styles.border}`} role="alert">
      <div className={`inline-flex items-center justify-center shrink-0 w-8 h-8 text-white rounded-lg ${styles.iconBg}`}>
        <i className={styles.icon}></i>
      </div>
      <div className={`ms-3 text-sm font-normal ${styles.text}`}>{message}</div>
      <button type="button" onClick={onClose} className="ms-auto bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" aria-label="Close">
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}

export default Toast;