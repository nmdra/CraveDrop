export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validatePhone = (number) => /^(?:0|94)?[7][0-9]{8}$/.test(number) // Sri Lankan format
