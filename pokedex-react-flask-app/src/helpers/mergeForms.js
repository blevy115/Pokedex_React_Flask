export function mergeForms(forms) {
    const mergedForms = forms.reduce((acc, cur) => {
        acc.push(...cur.pokemon_v2_pokemonforms)
        return acc
    }, [])
    return mergedForms
}