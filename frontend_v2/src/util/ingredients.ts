import pluralize from "pluralize"

pluralize.addUncountableRule('tbsp')
pluralize.addUncountableRule('tsp')
pluralize.addUncountableRule('ml')
pluralize.addUncountableRule('L')
pluralize.addUncountableRule('oz')
pluralize.addUncountableRule('g')
pluralize.addUncountableRule('kg')
pluralize.addUncountableRule('qt')
pluralize.addUncountableRule('pt')

const measureRegex = /((\d+)\/(\d+)|\d*\.\d+|\d+)\s?(tablespoons?|tbsp?|teaspoons?|tsp|cups?|pounds?|lbs?|grams?|g|oz|ounces?|fluid ounce|fl ?oz|packs?|handfuls?|slices?)?/gi

// TODO:
//  1: 1 apple -> 2 apples (pluralize the word after a single number or mixed number)
//  3: pluralize and highlight nouns/ingredients?

export const boldMeasurements = (ingredient: string) => {
    let res = []
    let m: RegExpExecArray | null
    let offset = 0

    do {
        m = measureRegex.exec(ingredient)

        let end = m ? m.index : ingredient.length
        if (end - offset > 0)
            res.push({ bold: false, value: ingredient.slice(offset, m ? m.index : ingredient.length) })

        if (!m) break

        const numerator = parseInt(m[2])
        const denominator = parseInt(m[3])
        const amount = !isNaN(numerator) ? numerator / denominator : parseFloat(m[1])
        const unit = m[4] ?? ""

        res.push({ bold: true, number: amount, unit: unit })
        offset = m.index + m[0].length

    } while (true)

    return res
}