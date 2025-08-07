// Grab elements
const monthInput = document.getElementById('month');
const dayInput = document.getElementById('day');
const yearInput = document.getElementById('year');

const calendarIcon = document.getElementById('calendar-icon');
const hiddenDatePicker = document.getElementById('hidden-date-picker');

const calculateBtn = document.getElementById('calculate-btn');
const resultBox = document.getElementById('result-box');

const resultYears = document.getElementById('result-years');
const resultMonths = document.getElementById('result-months');
const resultDays = document.getElementById('result-days');

const livedDays = document.getElementById('lived-days');
const livedWeeks = document.getElementById('lived-weeks');
const livedMonths = document.getElementById('lived-months');

const loading = document.getElementById('loading');


// 1. Calendar icon click opens hidden date input (native picker)
calendarIcon.addEventListener('click', () => {
  hiddenDatePicker.click();
});

// 2. When user picks date, update the three inputs
hiddenDatePicker.addEventListener('input', () => {
  if (!hiddenDatePicker.value) return;

  const [year, month, day] = hiddenDatePicker.value.split('-');

  yearInput.value = year;
  monthInput.value = month.padStart(2, '0');
  dayInput.value = day.padStart(2, '0');
});

// Helper function: pad input and limit max values
function padInput(input, max) {
  let val = input.value.replace(/\D/g, ''); // remove non-digit chars
  if (val.length === 1) {
    let num = parseInt(val, 10);
    val = num > max ? max.toString().padStart(2, '0') : val.padStart(2, '0');
  } else if (val.length > 2) {
    val = val.slice(0, 2);
  }
  input.value = val;
}

// 3. Input validations and auto-focus

// Month input: max 12, auto-focus day
monthInput.addEventListener('input', () => {
  let val = monthInput.value.replace(/\D/g, '');
  if (val.length >= 2) {
    let num = parseInt(val, 10);
    monthInput.value = num > 12 ? '12' : val.padStart(2, '0');
    dayInput.focus();
  } else {
    monthInput.value = val;
  }
});
monthInput.addEventListener('blur', () => padInput(monthInput, 12));

// Day input: max 31, auto-focus year
dayInput.addEventListener('input', () => {
  let val = dayInput.value.replace(/\D/g, '');
  if (val.length >= 2) {
    let num = parseInt(val, 10);
    dayInput.value = num > 31 ? '31' : val.padStart(2, '0');
    yearInput.focus();
  } else {
    dayInput.value = val;
  }
});
dayInput.addEventListener('blur', () => padInput(dayInput, 31));

// Year input: only digits, max length 4, pad with zeros on blur
yearInput.addEventListener('input', () => {
  yearInput.value = yearInput.value.replace(/\D/g, '').slice(0, 4);
});
yearInput.addEventListener('blur', () => {
  if (yearInput.value.length < 4) {
    yearInput.value = yearInput.value.padStart(4, '0');
  }
});

// 4. Calculate button click logic with loading and slide-down animation
calculateBtn.addEventListener('click', () => {
  // Hide results and remove previous animation class
  resultBox.style.display = 'none';
  resultBox.classList.remove('slide-down');

  // Show loading spinner
  loading.style.display = 'block';

  // Delay calculation to simulate loading (800ms)
  setTimeout(() => {
    const m = parseInt(monthInput.value, 10);
    const d = parseInt(dayInput.value, 10);
    const y = parseInt(yearInput.value, 10);

    // Basic validation
    if (!m || !d || !y) {
      alert('Please fill all fields correctly.');
      loading.style.display = 'none';
      return;
    }

    const birthDate = new Date(y, m - 1, d);
    const today = new Date();

    if (birthDate > today) {
      alert("You haven't been born yet 😉");
      loading.style.display = 'none';
      return;
    }

    // Calculate age
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total lived time
    const diffTime = Math.abs(today - birthDate);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Update UI
    resultYears.textContent = years;
    resultMonths.textContent = months;
    resultDays.textContent = days;

    livedDays.textContent = totalDays.toLocaleString();
    livedWeeks.textContent = totalWeeks.toLocaleString();
    livedMonths.textContent = totalMonths.toLocaleString();

    // Hide loading spinner and show result with slide-down animation
    loading.style.display = 'none';
    resultBox.style.display = 'block';
    resultBox.classList.add('slide-down');
  }, 800);
});
