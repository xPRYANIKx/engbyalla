const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

// Every section is shown in full. On compact screens adjust spacing and type
// to the available panel height; never paginate or hide individual entries.
function fitPanel(panel) {
  if (panel.hidden) return;
  const content = panel.querySelector('.panel-content');
  let density = 1;
  panel.style.setProperty('--density', density);
  while (content.offsetHeight > panel.clientHeight && density > .6) {
    density = Math.max(.6, density - .025);
    panel.style.setProperty('--density', density.toFixed(3));
  }
}
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  const active = document.getElementById(tab.getAttribute('aria-controls'));
  fitPanel(active);
  active.classList.remove('panel-enter');
  void active.offsetWidth;
  active.classList.add('panel-enter');
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      activateTab(tabs[next], true);
    }
  });
});
let resizeFrame;
new ResizeObserver(() => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => panels.forEach(fitPanel));
}).observe(document.querySelector('.panel-region'));
panels.forEach(fitPanel);

