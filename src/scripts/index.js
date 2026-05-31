/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, updateLikeState } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserInfo, getCardList, setUserInfo, setUserAvatar, createCard, removeCard, changeLikeCardStatus } from "./components/api.js";


// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");
const infoModalWindow = document.querySelector(".popup_type_info");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Вспомогательная функция для закрытия попапа и очистки формы
const closeAndClearForm = (modalWindow, formElement) => {
  clearValidation(formElement, validationSettings);
  closeModalWindow(modalWindow);
};
  
const handleInfoClick = (cardId) => {
  const cardInfoModalWindow = document.querySelector('.popup_type_info');
  const cardInfoModalInfoList = cardInfoModalWindow.querySelector('.popup__info');
  const userList = cardInfoModalWindow.querySelector('.popup__list');
  
  getCardList()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      
      if (cardData) {
        cardInfoModalInfoList.innerHTML = '';
        userList.innerHTML = '';
        
        const title = cardInfoModalWindow.querySelector('.popup__title');
        title.textContent = 'Информация о карточке';
        
        const descriptionTemplate = document.getElementById('popup-info-definition-template');
        const descriptionClone = descriptionTemplate.content.cloneNode(true);
        
        const descriptionTerm = descriptionClone.querySelector('.popup__info-term');
        const descriptionDescription = descriptionClone.querySelector('.popup__info-description');
        
        descriptionTerm.textContent = 'Описание:';
        descriptionDescription.textContent = cardData.name;
        
        cardInfoModalInfoList.appendChild(descriptionClone);///

        const dateTemplate = document.getElementById('popup-info-definition-template');
        const dateClone = dateTemplate.content.cloneNode(true);
        
        const dateTerm = dateClone.querySelector('.popup__info-term');
        const dateDescription = dateClone.querySelector('.popup__info-description');
        
        dateTerm.textContent = 'Дата создания:';
        dateDescription.textContent = formatDate(new Date(cardData.createdAt));
        
        cardInfoModalInfoList.appendChild(dateClone);///
        
        const ownerTemplate = document.getElementById('popup-info-definition-template');
        const ownerClone = ownerTemplate.content.cloneNode(true);
        
        const ownerTerm = ownerClone.querySelector('.popup__info-term');
        const ownerDescription = ownerClone.querySelector('.popup__info-description');
        
        ownerTerm.textContent = 'Владелец:';
        ownerDescription.textContent = cardData.owner.name;
        
        cardInfoModalInfoList.appendChild(ownerClone);///

        const likesTemplate = document.getElementById('popup-info-definition-template');
        const likesClone = likesTemplate.content.cloneNode(true);
        
        const likesTerm = likesClone.querySelector('.popup__info-term');
        const likesDescription = likesClone.querySelector('.popup__info-description');
        
        likesTerm.textContent = 'Количество лайков:';
        likesDescription.textContent = cardData.likes.length;
        
        cardInfoModalInfoList.appendChild(likesClone);///
        
        const usersTitleTemplate = document.getElementById('popup-info-definition-template');
        const usersTitleClone = usersTitleTemplate.content.cloneNode(true);
        const usersTitleTerm = usersTitleClone.querySelector('.popup__info-term');
        usersTitleTerm.innerHTML = '<strong>Лайкнули:</strong>';
        usersTitleTerm.classList.add('popup__liked_title');
        cardInfoModalInfoList.appendChild(usersTitleClone);

        const userTemplate = document.getElementById('popup-info-user-preview-template');
        cardData.likes.forEach(like => {
          const userClone = userTemplate.content.cloneNode(true);
          const userName = userClone.querySelector('.popup__list-item');
          userName.textContent = like.name;
          userList.appendChild(userClone);
        });
        openModalWindow(cardInfoModalWindow);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const setLoading = (submitButton, text) => {
  submitButton.textContent = text;
  submitButton.disabled = true;
};

const resetLoading = (submitButton, initialText) => {
  submitButton.textContent = initialText;
  submitButton.disabled = false;
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = profileForm.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  setLoading(submitButton, "Сохранение...");

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeAndClearForm(profileFormModalWindow, profileForm);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      resetLoading(submitButton, initialText);
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  setLoading(submitButton, "Сохранение...");

  setUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeAndClearForm(avatarFormModalWindow, avatarForm);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      resetLoading(submitButton, initialText);
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = cardForm.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  setLoading(submitButton, "Создание...");

  createCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardInformations) => {
      placesWrap.prepend(
        createCardElement(cardInformations, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
          onInfoClick: handleInfoClick,
        }, currentUserId)
      );
      closeAndClearForm(cardFormModalWindow, cardForm);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      resetLoading(submitButton, initialText);
    });
};

const deleteCard = (cardElement, cardId) => {
  removeCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(err);
    });
};

const likeCard = (likeButton, cardId) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  changeLikeCardStatus(cardId, isLiked)
    .then((cardElement) => {
      updateLikeState(likeButton, cardElement.likes.length);
    })
    .catch((err) => {
      console.error(err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

const clearProfileForm = () => clearValidation(profileForm, validationSettings);
const clearCardForm = () => clearValidation(cardForm, validationSettings);
const clearAvatarForm = () => clearValidation(avatarForm, validationSettings);

setCloseModalWindowEventListeners(profileFormModalWindow, profileForm, clearProfileForm);
setCloseModalWindowEventListeners(cardFormModalWindow, cardForm, clearCardForm);
setCloseModalWindowEventListeners(avatarFormModalWindow, avatarForm, clearAvatarForm);
setCloseModalWindowEventListeners(imageModalWindow);
setCloseModalWindowEventListeners(infoModalWindow);

enableValidation(validationSettings);

let currentUserId;

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    cards.forEach((card) => {
      placesWrap.append(
        createCardElement(card, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
          onInfoClick: handleInfoClick,
        }, currentUserId)
      );
    });
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch((err) => {
    console.error(err);
  });
