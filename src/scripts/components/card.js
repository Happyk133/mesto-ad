const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick }, idOwner, isLiked
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
  likeCount.textContent = data.likes.length;

  if (!idOwner){
    deleteButton.style.display = "none";
  }

  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }
  
  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      onLikeIcon(likeButton, data._id);
    })
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data._id));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  if (onInfoClick) {
    infoButton.addEventListener("click", () => {
      onInfoClick(data._id);
    });
  }

  return cardElement;
};
