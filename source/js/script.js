let headerMain = document.querySelector('.main-header');
let navMain = document.querySelectorAll('.main-nav');
let navToggle = document.querySelector('.main-header__menu-open');

headerMain.classList.remove('main-header--nojs');

for (let i of navMain) {
  if (i.classList.contains('main-nav--opened')) {
    i.classList.add('main-nav--closed');
    i.classList.remove('main-nav--opened');
  }
}

navToggle.addEventListener('click', function () {
  for (let i of navMain) {
    if (i.classList.contains('main-nav--closed')) {
      i.classList.remove('main-nav--closed');
      i.classList.add('main-nav--opened');
    } else if (i.classList.contains('main-nav--opened')) {
      i.classList.add('main-nav--closed');
      i.classList.remove('main-nav--opened');
    }
  }
})
