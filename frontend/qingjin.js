document.querySelector('#qingjin').addEventListener('click', event => {
  const page = event.target.closest('[data-cover]')?.dataset.cover;
  if (page === 'guide') document.querySelector('#guideNav').click();
  else if (page) window.TongpinNavigate(page);
});
