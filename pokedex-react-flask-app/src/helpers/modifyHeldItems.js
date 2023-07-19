export function modifyHeldItems(data) {
  const distinctItemsByGeneration = {};
  data.forEach((itemData) => {
    const {
      pokemon_v2_version: {
        pokemon_v2_versiongroup: { generation_id },
      },
      pokemon_v2_item: item,
    } = itemData;
    const key = generation_id;
    if (!distinctItemsByGeneration[key]) {
      distinctItemsByGeneration[key] = [];
    }
    const existingItemIndex = distinctItemsByGeneration[key].findIndex(
      (existingItem) => existingItem.id === item.id
    );

    if (existingItemIndex === -1) {
      distinctItemsByGeneration[key].push({
        name: item.name,
        rarity: itemData.rarity,
        id: item.id,
      });
    } else if (
      itemData.rarity > distinctItemsByGeneration[key][existingItemIndex].rarity
    ) {
      distinctItemsByGeneration[key][existingItemIndex] = {
        name: item.name,
        rarity: itemData.rarity,
        id: item.id,
      };
    }
  });
  return distinctItemsByGeneration;
}
