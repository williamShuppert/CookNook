import Fraction from "fraction.js"
import pluralize from "pluralize"
import { ReactNode } from "react"

pluralize.addUncountableRule('tbsp')
pluralize.addUncountableRule('tsp')
pluralize.addUncountableRule('ml')
pluralize.addUncountableRule('L')
pluralize.addUncountableRule('oz')
pluralize.addUncountableRule('g')
pluralize.addUncountableRule('kg')
pluralize.addUncountableRule('qt')
pluralize.addUncountableRule('pt')

// Number regexes
const fractionPattern = '(?:(\\d+)\\s)?(\\d+)\\/(\\d+)'
const rangePattern = '(\\d+)-(\\d+)'
const floatPattern = '\\d*\\.\\d+|\\d+'
const numberPattern = [fractionPattern, rangePattern, floatPattern].join('|')

// Unit regexes
const unitPatterns: {[id: string]: string} =  {
    time: 'hours?|hrs?|minutes?|mins?|seconds?|secs?|days?|weeks?|months?|years?',
    temp: 'kelvin|degrees?|deg|°[CFK]|°|C|F|K',
    length: 'kilometers?|km|yards?|yds?|millimeters?|mm|centimeters?|cm|meters?|m|foot|feet|ft|\'|inch(?:es)?|in|"',
    weight: 'kilograms?|kg|milligrams?|mg|stones?|pounds?|lbs?|grams?|g|ounces?|oz',
    volume: 'milliliters?|ml|liters?|L|tablespoons?|tbsp?|teaspoons?|tsp|cups?|fluid ounce|fl ?oz',
    misc: 'packs?|handfuls?|slices?|cloves?|sticks?|bunch(?:es)?|pinch(?:es)?|dash(?:es)?'
}

// Measurement regex
const units = []
for (let type in unitPatterns)
    units.push(...unitPatterns[type].split('|'))
units.sort((a, b) => b.length - a.length) // must be sorted by length for regex to work correctly
const unitsPattern = units.join('|')
const measurementRegex = new RegExp(`(${numberPattern})\\s?(?:(${unitsPattern})(?!\\w))?`, 'gi')

// TODO:
//  1: 1 apple -> 2 apples (pluralize the word after a single number or mixed number)
//  3: highlight words that show up in ingredient list?

export type MeasurementToken = ((multiplier: number, i: number) => ReactNode)

export const parseMeasurements = (ingredient: string): MeasurementToken[] => {
    let res = []
    let m: RegExpExecArray | null
    let offset = 0

    do {
        m = measurementRegex.exec(ingredient)

        let end = m ? m.index : ingredient.length
        if (end - offset > 0) {
            // push strings that are between measurements
            const slice = ingredient.slice(offset, m ? m.index : ingredient.length)
            res.push(() => slice)
        }

        if (!m) break

        // RegEx groups:
        const match = m[0]
        const numberStr = m[1]
        const whole = m[2] ? parseInt(m[2]) : 0
        const numerator = parseInt(m[3])
        const denominator = parseInt(m[4])
        const minRange = parseFloat(m[5])
        const maxRange = parseFloat(m[6])
        const unit = m[7] ?? ""

        let amount
        if (minRange) amount = minRange
        else if (!isNaN(numerator)) amount = whole + (numerator / denominator)
        else amount = parseFloat(numberStr)

        // these units should not be scaled
        const noScale = new RegExp(`(${unitPatterns.time})$`, 'i').test(unit)
            || new RegExp(`(${unitPatterns.temp})$`, 'i').test(unit)
            || new RegExp(`(${unitPatterns.length})$`, 'i').test(unit)

        if (!noScale)
            res.push((multiplier: number, i: number) => {
                const num = amount * multiplier
                return <strong key={i}>{new Fraction(num).toFraction(true)} {pluralize(unit, num)}</strong>
            })
        else
            res.push((_: number, i: number) => <strong key={i}>{match}</strong>)

        offset = m.index + match.length

    } while (true)

    return res
}