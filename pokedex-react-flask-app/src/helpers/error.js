export function handleSpriteError(ele) {
  ele.target.src = "/icons/error/missingno.png";
  ele.target.height = 96;
  ele.target.width = 96;
}

export function handleItemError(ele) {
  ele.target.src = "/icons/error/item-ball.png";
  ele.target.height = 20;
  ele.target.width = 20;
  ele.target.style.margin = "0 0.25rem"
}