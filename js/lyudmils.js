function applyDarkMode(on = true) {
  const method = on ? 'add' : 'remove';
  document.querySelectorAll('.body-light').forEach(target => target.classList[method]('is-dark'));
  document.querySelectorAll('.nav-links').forEach(target => target.classList[method]('nav-links-dark'));
  document.querySelectorAll('.subtxt').forEach(target => target.classList[method]('subtxt-dark'));
  document.querySelectorAll('.contact-link').forEach(target => target.classList[method]('contact-link-dark'));
  document.querySelectorAll('.p-link-tt').forEach(target => target.classList[method]('p-link-tt-dark'));
  document.querySelectorAll('.work-wrap').forEach(target => target.classList[method]('work-wrap-dark'));
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Apply theme on load
applyDarkMode(systemPrefersDark());

// Update theme dynamically if system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  applyDarkMode(e.matches);
});

// function toggleClass() {
//   document.querySelectorAll('.body-light').forEach(target => target.classList.toggle('is-dark'));
//   document.querySelectorAll('.nav-links').forEach(target => target.classList.toggle('nav-links-dark'));
//   document.querySelectorAll('.subtxt').forEach(target => target.classList.toggle('subtxt-dark'));
//   document.querySelectorAll('.contact-link').forEach(target => target.classList.toggle('contact-link-dark'));
//   document.querySelectorAll('.p-link-tt').forEach(target => target.classList.toggle('p-link-tt-dark'));
//   document.querySelectorAll('.work-wrap').forEach(target => target.classList.toggle('work-wrap-dark'));
// }
// if(localStorage.getItem('theme') === "dark") {
// 	toggleClass();
// }
// const themeSwitcher = document.querySelector('.mode-switch');
// themeSwitcher.addEventListener('click', function() {
// 	toggleClass();
//     if(localStorage.getItem('theme') === "dark") {
// 	  localStorage.removeItem('theme');
//     } else {
//       localStorage.setItem('theme', 'dark');
//     }
// })