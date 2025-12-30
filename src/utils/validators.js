const validateGuestData = (data) => {
  const { phone, name } = data;
  const errors = [];

  if (!phone || !name) {
    errors.push('Поля phone и name обязательны');
  }

  if (phone && phone.toString().trim().length === 0) {
    errors.push('Поле phone не может быть пустым');
  }

  if (name && name.toString().trim().length === 0) {
    errors.push('Поле name не может быть пустым');
  }

  if (name && (name.toString().trim().length < 2 || name.toString().trim().length > 100)) {
    errors.push('Имя должно быть от 2 до 100 символов');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateGuestData
};