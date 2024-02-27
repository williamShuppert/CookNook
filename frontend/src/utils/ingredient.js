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

// Units = { unitType: { unitHeader: [alias] } }
export const Units = {
    "volume": {
      "cup": ["cup", "cups"],
      "teaspoon": ["teaspoon", "teaspoons", "tsp"],
      "tablespoon": ["tablespoon", "tablespoons", "tbsp", "tbs"],
      "fluid ounce": ["fluid ounce", "fluid ounces", "fl oz", "fl-oz"],
      "pint": ["pint", "pints", "pt", "pnt"],
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
        const unitHeaders = Units[unitType]
        for (const unitHeader in unitHeaders) {
            const aliases = unitHeaders[unitHeader]
            if (aliases.includes(str.toLowerCase()))
                return { unitType, unitHeader }
        }
    }
    return null
}

function trimSpecialCharacters(inputString) {
    // TODO: put trimmed chars back in but don't bold them
    const res = {
        trimmed: inputString,
        left: '', right: ''
    }

    if (inputString.length >= 2) {
        if (/[,()\[\]{}'"]/.test(res.trimmed[0])) {
            res.left = res.trimmed[0]
            res.trimmed = res.trimmed.slice(1)
        }

        if (/[.,()\[\]{}'"]/.test(res.trimmed.slice(-1))) {
            res.right = res.trimmed.slice(-1)
            res.trimmed = res.trimmed.slice(0, -1)
        }
    }
    return res.trimmed
}

export const getNumFormat = (str) => {
    const fractionRegex = /(?:[1-9][0-9]*|0)\/[1-9][0-9]*/

    if (!isNaN(str) && str != '')
        return "num"
    else if (fractionRegex.test(str))
        return "frac"
    
    return "NaN"
}
// Add the marinade ingredients (2 tablespoon of tamari and 1 tablespoon of apple cider vinegar), stir and let rest for at least 5 minutes, preferably overnight.
export const extractMeasurements = (string) => {
    if (string == '')
        return []

    let tokens = []
    const words = string.split(' ')
    for (let i = 0; i < words.length; i++) {
        if (words[i] == '') continue

        const word1 = trimSpecialCharacters(words[i])
        const word2 = i < words.length - 1 ? trimSpecialCharacters(words[i + 1]) : null
        const word3 = i < words.length - 2 ? trimSpecialCharacters(words[i + 2]) : null

        const token = {
            isMeasurement: false,
            string: i != 0 ? ' ' : '',
            value: null,
            unit: null,
            unitType: null,
            unitHeader: null
        }
          
        if (i < words.length - 2 && getNumFormat(word1) === 'num' && getNumFormat(word2) === 'frac' && getUnitType(word3)) {
           // Check for int, frac, and unit
            token.string += `${words[i]} ${words[i + 1]} ${words[i + 2]}`
            token.value = new Fraction(`${word1} ${word2}`)
            token.unit = word3
            token.unitType = getUnitType(word3).unitType
            token.unitHeader = getUnitType(word3).unitHeader
            i += 2
        } else if (i < words.length - 1 && getNumFormat(word1) === 'num' && getUnitType(word2)) {
            // Check for int and unit
            token.string += `${words[i]} ${words[i + 1]}`
            token.value = new Fraction(word1)
            token.unit = word2
            token.unitType = getUnitType(word2).unitType
            token.unitHeader = getUnitType(word2).unitHeader
            i += 1
        } else if (i < words.length - 1 && getNumFormat(word1) === 'frac' && getUnitType(word2)) {
            // Check for frac and unit
            token.string += `${words[i]} ${words[i + 1]}`
            token.value = new Fraction(word1)
            token.unit = word2
            token.unitType = getUnitType(word2).unitType
            token.unitHeader = getUnitType(word2).unitHeader
            i += 1
        } else if (getNumFormat(word1) === 'num' || getNumFormat(word1) === 'frac') {
            // Check for just int or frac
            token.string += `${words[i]}`
            console.log(word1)
            token.value = new Fraction(word1)
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