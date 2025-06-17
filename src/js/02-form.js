const form = document.querySelector('.feedback-form');
const STORAGE_KEY = 'feedback-form-state';

let submitted = false;

function getSavedData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : { email: '', message: '' };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFormData() {
  const data = getSavedData();
  form.elements.email.value = data.email || '';
  form.elements.message.value = data.message || '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSave = debounce(data => {
  saveData(data);
}, 500);

function onInputChange(event) {
  const { name, value } = event.target;
  if (!['email', 'message'].includes(name)) return;

  if (submitted) {
    // Submit sonrası ilk input değişiminde eski veriyi temizle
    localStorage.removeItem(STORAGE_KEY);
    submitted = false;
  }

  const savedData = getSavedData();
  const updatedData = { ...savedData, [name]: value.trim() };

  debouncedSave(updatedData);
}

function onFormSubmit(event) {
  event.preventDefault();

  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  if (!email || !message) {
    alert('Lütfen hem email hem de mesaj alanını doldurun.');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Lütfen geçerli bir email adresi girin.');
    return;
  }

  const submittedData = { email, message };
  console.log('Gönderilen veri:', submittedData);

  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  submitted = true; // Submit edildi bilgisi
}

form.addEventListener('input', onInputChange);
form.addEventListener('submit', onFormSubmit);

loadFormData();
