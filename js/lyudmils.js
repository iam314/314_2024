function toggleClass() {
  document.querySelectorAll('.body-light').forEach(target => target.classList.toggle('is-dark'));
  document.querySelectorAll('.nav-links').forEach(target => target.classList.toggle('nav-links-dark'));
  document.querySelectorAll('.subtxt').forEach(target => target.classList.toggle('subtxt-dark'));
  document.querySelectorAll('.contact-link').forEach(target => target.classList.toggle('contact-link-dark'));
  document.querySelectorAll('.p-link-tt').forEach(target => target.classList.toggle('p-link-tt-dark'));
  document.querySelectorAll('.work-wrap').forEach(target => target.classList.toggle('work-wrap-dark'));
}
if(localStorage.getItem('theme') === "dark") {
	toggleClass();
}
const themeSwitcher = document.querySelector('.mode-switch');
themeSwitcher.addEventListener('click', function() {
	toggleClass();
    if(localStorage.getItem('theme') === "dark") {
	  localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', 'dark');
    }
})