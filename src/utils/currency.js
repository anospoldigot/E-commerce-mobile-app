function numberFormat(number, decimals = 0, decimalSeparator = '.', thousandsSeparator = ',') {
    number = parseFloat(number);

    if (isNaN(number)) {
        return '';
    }

    let fixedNumber = number.toFixed(decimals);
    let [integerPart, decimalPart] = fixedNumber.split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

    if (decimals > 0) {
        return integerPart + decimalSeparator + decimalPart;
    }

    return integerPart;
}

export {
    numberFormat
}