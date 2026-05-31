const popupClearHandlers = new Map();

const handleEscUp = (evt) => {
  if (evt.key === "Escape") {
    const activePopup = document.querySelector(".popup_is-opened");
    if (activePopup) {
      const clearFn = popupClearHandlers.get(activePopup);
      if (typeof clearFn === "function") {
        clearFn();
      }
      closeModalWindow(activePopup);
    }
  }
};

export const openModalWindow = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keyup", handleEscUp);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", handleEscUp);
};

export const setCloseModalWindowEventListeners = (modalWindow, formElement = null, clearFn = null) => {
  if (typeof clearFn === "function") {
    popupClearHandlers.set(modalWindow, clearFn);
  }
  
  const closeButtonElement = modalWindow.querySelector(".popup__close");
  
  const handleClose = () => {
    if (typeof clearFn === "function") {
      clearFn();
    }
    closeModalWindow(modalWindow);
  };
  
  closeButtonElement.addEventListener("click", handleClose);

  modalWindow.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("popup")) {
      handleClose();
    }
  });
};
