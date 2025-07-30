
const EMAIL_REGEX = /^(()|([\w-\\.]+@([\w-]+\.)+[\w-]{2,4}))?$/;
const VEHICLE_MODEL_REGEX = /^[A-Za-z0-9]*$/;
const ALPHABET_WITH_SPACE_REGEX = /^([a-zA-Z0-9]+\s?)*$/;
const ADDRESS_REGEX = /^[^\s]+[A-Za-z0-9'\.\-\s\,].*/;
const PAN_NUMBER_REGEX = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
const WORD_WITH_SPACE_REGEX = /[^a-zA-Z ]/g;
const WORD_REGEX = /[^a-zA-Z]/g;
const NUMBER_REGEX = /\D/g;
const AADHAR_NUMBER_REGEX = /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/
const GST_REGEX = /(()|\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1})/;
const LICENCE_REGEX = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
const BHIM_REGEX = /(()|[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,})/;
const VEHICLE_REGEX = /^([A-Z]{2}[ ,-]{0,1}[0-9]{2}[ ,-]{0,1}[A-Z]{1,2}[ ,-]{0,1}[0-9]{4})|([0-9]{2}[ ,-]{0,1}BH[ ,-]{0,1}[0-9]{4}[ ,-]{0,1}[A-Z]{2})$/;
const STATE_REGEX = /^([a-zA-Z0-9]+\s?)*$/;
const CITY_REGEX = /^([a-zA-Z0-9]+\s?)*$/;
const PINCODE_REGEX = /^[1-9]{1}[0-9]{2}[0-9]{3}$/;
const MOBILE_NUMBER_REGEX = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
const BANKNAME_REGEX = /^([a-zA-Z0-9]+\s?)*$/;
const ACCOUNTNUMBER_REGEX = /^[1-9]{1}[0-9]{5}[0-9]{3}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
export {
    EMAIL_REGEX, ALPHABET_WITH_SPACE_REGEX, ADDRESS_REGEX, PAN_NUMBER_REGEX, WORD_WITH_SPACE_REGEX, NUMBER_REGEX, WORD_REGEX, AADHAR_NUMBER_REGEX,
    GST_REGEX, LICENCE_REGEX, BHIM_REGEX, VEHICLE_REGEX, IFSC_REGEX, ACCOUNTNUMBER_REGEX, BANKNAME_REGEX, PINCODE_REGEX, CITY_REGEX,
    STATE_REGEX, VEHICLE_MODEL_REGEX, regex, MOBILE_NUMBER_REGEX
};