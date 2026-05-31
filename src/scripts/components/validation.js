const showInputError = (formElement, inputElement, errorMessage, validationSettings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(validationSettings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationSettings.errorClass);
};

const hideInputError = (formElement, inputElement, validationSettings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(validationSettings.inputErrorClass);
  errorElement.classList.remove(validationSettings.errorClass);
  errorElement.textContent = '';
};

const checkInputValidity = (formElement, inputElement, validationSettings) => {
  if (inputElement.validity.patternMismatch){
    inputElement.setCustomValidity(inputElement.dataset.errorMessage)
  } else {
    inputElement.setCustomValidity('')
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationSettings);
  } else {
    hideInputError(formElement, inputElement, validationSettings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableSubmitButton = (buttonElement, validationSettings) => {
  buttonElement.classList.add(validationSettings.inactiveButtonClass)
  buttonElement.disabled = true
}

const enableSubmitButton = (buttonElement, validationSettings) => {
  buttonElement.classList.remove(validationSettings.inactiveButtonClass)
  buttonElement.disabled = false
}

const toggleButtonState = (inputList, buttonElement, validationSettings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, validationSettings)
  } else {
    enableSubmitButton (buttonElement, validationSettings)
  }
};

const setEventListeners = (formElement, validationSettings) => {
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  const buttonElement = formElement.querySelector(validationSettings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationSettings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, validationSettings);
      toggleButtonState(inputList, buttonElement, validationSettings);
    });
  });
};

export const clearValidation = (formElement, validationSettings) => {
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  const buttonElement = formElement.querySelector(validationSettings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationSettings)
  })
  disableSubmitButton(buttonElement, validationSettings)
}

export const enableValidation = (validationSettings) => {
  const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationSettings);
  });
};