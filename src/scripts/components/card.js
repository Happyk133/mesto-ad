const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const updateLikeState = (likeButton, likesCount) => {
  likeButton.classList.toggle("card__like-button_is-active");
  const cardElement = likeButton.closest(".card");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  likeCountElement.textContent = likesCount;
};

export const removeCardElement = (cardElement) => {
  cardElement.remove();
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick },
  userId
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCount = cardElement.querySelector(".card__like-count");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  likeCount.textContent = data.likes ? data.likes.length : 0;

  const isOwner = data.owner ? data.owner._id === userId : true;
  const isLiked = data.likes ? data.likes.some((like) => like._id === userId) : false;

  if (!isOwner) {
    deleteButton.style.display = "none";
  }

  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      onLikeIcon(likeButton, data._id);
    });
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data._id));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({ name: data.name, link: data.link }));
  }

  if (onInfoClick) {
    infoButton.addEventListener("click", () => {
      onInfoClick(data._id);
    });
  }

  return cardElement;
};
