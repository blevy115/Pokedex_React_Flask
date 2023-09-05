function getAnimatedSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
}

function getSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function getFormSprite(path) {
  console.log(path)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/${path?.replace('media', 'master')}`
}

function getImage(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getShinyImage(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

function getItemSprite(name) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png` 
}

export { getAnimatedSprite, getSprite, getImage, getShinyImage, getItemSprite, getFormSprite };
