
const ConvertToArabicNumbers = (num) => {
    const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});

}
const convertDate = (date=null) => {
    return new Date(date).toLocaleDateString('ar-EG-u-nu-latn',{weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'});
}
const fullDate = (d=null) => {
        const date = new Date(d);
    options = {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            };
    return date.toLocaleDateString(
        // 'en-US'
        'ar-SA'
        , options);
    
}


const prodState = () => {
    return false
}

module.exports = {
    convertToArabicNumbers:ConvertToArabicNumbers,
    convertDate:convertDate,
    fullDate:fullDate,
    prodState:prodState

}