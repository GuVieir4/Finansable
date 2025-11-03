function Toast({ onClose }) {
  return (
    <div id="toast-default" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-gray-300 rounded-lg shadow-sm fixed bottom-5 right-5 z-50" role="alert">
      <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-white bg-[#264533] rounded-lg">
        <i class="fa-regular fa-bell"></i>
      </div>
      <div className="ms-3 text-sm font-normal text-[#264533]">Notificações ativadas!</div>
      <button type="button" onClick={onClose} className="ms-auto bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}

export default Toast;