import clm from 'country-locale-map'

/**
 * This function tries to find the alpha2 code (https://en.wikipedia.org/wiki/ISO_3166-1) for a country provided as 
 * search input
 * @param {String} countryTerm 
 */
export function getCountryAlpha2(countryTerm) {

    const uppercaseTerm = countryTerm.toUpperCase()
    let alpha2 = clm.getAlpha2ByAlpha3(uppercaseTerm)

    // it's not an alpha3, let's see if it's an alpha2
    if (!alpha2 && clm.getCountryNameByAlpha2(uppercaseTerm)) {
        alpha2 = uppercaseTerm
    }

    // if we still don't get an alpha2 our last resort is to try a fuzzy seach by country name
    if (!alpha2) {
        alpha2 = clm.getAlpha2ByName(uppercaseTerm, true)
    }

    return alpha2
}

export function getCountry(countryAlpha2) {

    return clm.getCountryByAlpha2(countryAlpha2);
}