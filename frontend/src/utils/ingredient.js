import Fraction from "fraction.js"
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

export const Units = {
    "volume": {
      "cup": ["cup", "cups"],
      "teaspoon": ["teaspoon", "teaspoons", "tsp"],
      "tablespoon": ["tablespoon", "tablespoons", "tbsp"],
      "fluid ounce": ["fluid ounce", "fluid ounces", "fl oz", "fl-oz"],
      "pint": ["pint", "pints", "pt"],
      "quart": ["quart", "quarts", "qt"],
      "gallon": ["gallon", "gallons", "gal"],
      "milliliter": ["milliliter", "milliliters", "ml"],
      "liter": ["liter", "liters", "L"]
    },
    "weight": {
      "gram": ["gram", "grams", "g"],
      "kilogram": ["kilogram", "kilograms", "kg"],
      "pound": ["pound", "pounds", "lb", "lbs"],
      "ounce": ["ounce", "ounces", "oz"]
    },
    "length": {
      "inch": ["inch", "inches", "in"],
      "foot": ["foot", "feet", "ft"],
      "yard": ["yard", "yards", "yd"],
      "meter": ["meter", "meters", "m"]
    },
    "countable": {
      "clove": ["clove", "cloves"],
      "piece": ["piece", "pieces"],
      "dozen": ["dozen", "dozens"],
      "drop": ["drop", "drops"],
      "handful": ["handful", "handfuls"],
      "package": ["package", "packages"],
      "slice": ["slice", "slices"],
      "can": ["can", "cans"],
      "jar": ["jar", "jars"],
      "bunch": ["bunch", "bunches"],
      "head": ["head", "heads"],
      "stalk": ["stalk", "stalks"],
      "spoon": ["spoon", "spoons"],
      "scoop": ["scoop", "scoops"]
    },
    "specialized": {
      "dash": ["dash", "dashes"],
      "pinch": ["pinch", "pinches"],
      "smidgen": ["smidgen", "smidgens"]
    },
    "time": {
      "second": ["second", "seconds"],
      "minute": ["minute", "minutes", "min"],
      "hour": ["hour", "hours", "hr"]
    }
}

export const descriptors = {
    "large": ["large", "lg"],
    "medium": ["medium", "med"],
    "small": ["small", "sm"],
    "tiny": ["tiny"],
}

export const UnitTypesAffectedByServingSize = [
    'volume', 'weight', 'countable', 'specialized'
]

export const getUnitType = (str) => {
    for (const unitType in Units) {
        const units = Units[unitType]
        for (const unit in units) {
            const aliases = units[unit]
            if (aliases.includes(str.toLowerCase()))
                return unitType
        }
    }
    return null
}

export const getNumFormat = (s) => {
    const fractionRegex = /(?:[1-9][0-9]*|0)\/[1-9][0-9]*/

    if (!isNaN(s))
        return "num"
    else if (fractionRegex.test(s))
        return "frac"
    
    return "NaN"
}

export const extractMeasurements = (string) => {
    if (string == '')
        return []

    let tokens = []
    const words = string.split(' ')
    for (let i = 0; i < words.length; i++) {
        const token = {
            isMeasurement: false,
            string: i != 0 ? ' ' : '',
            value: null,
            unit: null,
            unitType: null,
        }
          
        if (i < words.length - 2 && getNumFormat(words[i]) === 'num' && getNumFormat(words[i + 1]) === 'frac' && getUnitType(words[i + 2])) {
           // Check for int, frac, and unit
            token.string += `${words[i]} ${words[i + 1]} ${words[i + 2]}`
            token.value = new Fraction(`${words[i]} ${words[i + 1]}`)
            token.unit = words[i + 2]
            token.unitType = getUnitType(words[i + 2])
            i += 2
        } else if (i < words.length - 1 && getNumFormat(words[i]) === 'num' && getUnitType(words[i + 1])) {
            // Check for int and unit
            token.string += `${words[i]} ${words[i + 1]}`
            token.value = new Fraction(words[i])
            token.unit = words[i + 1]
            token.unitType = getUnitType(words[i + 1])
            i += 1
        } else if (i < words.length - 1 && getNumFormat(words[i]) === 'frac' && getUnitType(words[i + 1])) {
            // Check for frac and unit
            token.string += `${words[i]} ${words[i + 1]}`
            token.value = new Fraction(words[i])
            token.unit = words[i + 1]
            token.unitType = getUnitType(words[i + 1])
            i += 1
        } else if (getNumFormat(words[i]) === 'num' || getNumFormat(words[i]) === 'frac') {
            // Check for just int or frac
            token.string += `${words[i]}`
            token.value = new Fraction(words[i])
            token.unitType = "countable"
        }

        token.isMeasurement = token.value != null

        if (!token.isMeasurement) {
            token.string += words[i]

            if (tokens.length > 0 && !tokens[tokens.length - 1].isMeasurement) {
                // Don't need a new token if both this and prev tokens aren't measurements
                tokens[tokens.length - 1].string += ' ' + words[i]
                continue
            }
        }

        tokens.push(token)
    }

    return tokens
}