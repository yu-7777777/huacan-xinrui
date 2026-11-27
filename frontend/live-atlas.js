document.addEventListener('DOMContentLoaded', async () => {
  const words = document.querySelector('#words');
  const exhibit = document.createElement('section');
  exhibit.className = 'object-exhibit';
  exhibit.innerHTML = '<figure><figcaption>码头边的自行车</figcaption></figure><article><h2>四地词签</h2><dl></dl><small>地区用语示例，各地也有其他说法。</small></article>';
  try {
    const data = await (await fetch('words.json')).json();
    const bike = data.find(item => item.left === '自行车');
    if (!bike) return;
    ['大陆','香港','澳门','台湾地区'].forEach((region,i) => {
      const label = document.createElement('dt'), term = document.createElement('dd');
      label.textContent = region; term.textContent = bike.regions[i];
      exhibit.querySelector('dl').append(label,term);
    });
    words.querySelector('.page-heading').after(exhibit);
  } catch { /* The original search and example library remain available. */ }
});
