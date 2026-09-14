'use strict';
// Static landing page: no uploads, payments, analytics or network requests.
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => { const open = navigation.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
// Each segment explicitly identifies unchanged text, removed text or added text.
// All sample content is fictional; it is not medical or regulatory guidance.
const examples = {
 rmp: { title: '문서 개정 예시', rows: [
  ['머리글', ['안전관리 문서 · 버전 ', {del:'1.0'}], ['안전관리 문서 · 버전 ', {add:'1.1'}], '중요 변경 · 버전 정보\n변경 사유 기재 필요'],
  ['1.1 문서 표기', ['검토 ', {del:'결 과'}, '를 기록한다.'], ['검토 ', {add:'결과'}, '를 기록한다.'], '서식·표기 정비\n단순 서식/표기 정비(확인 필요)'],
  ['1.2 문장 정리', [{del:'담당자는 문서를 검토하는 업무를 수행한다.'}], [{add:'담당자는 문서를 검토한다.'}], '의미 유지 문장 정비 가능성\n가독성 및 해석 용이성 제고를 위한 문장 정비(확인 필요)'],
  ['2.1 검토 절차', ['(생략)\n담당자는 검토 결과를 ', {del:'이메일로 공유한다.'}], ['(좌동)\n담당자는 검토 결과를 ', {add:'문서 관리 시스템에 등록한다.'}], '중요 변경 · 절차\n변경 사유 기재 필요'],
  ['2.2 검토 기한', ['담당자는 접수 후 ', {del:'7일'}, ' 이내에 검토한다.'], ['담당자는 접수 후 ', {add:'3일'}, ' 이내에 검토한다.'], '중요 변경 · 기한\n변경 사유 기재 필요'],
  ['3.2 기록 관리', ['—'], [{add:'검토 이력에는 검토일과 승인자를 기록한다.'}], '문단 추가 · 근거 없음\n변경 사유 기재 필요'],
  ['4.1 배포 절차', [{del:'인쇄본을 각 부서에 배포한다.'}], ['—'], '문단 삭제 · 근거 없음\n변경 사유 기재 필요'],
  ['바닥글', ['문서번호 PV-', {del:'001'}], ['문서번호 PV-', {add:'002'}], '식별 정보 변경 · 근거 없음\n변경 사유 기재 필요']
 ]},
 pbrer: { title: '허가사항 형식 예시', rows: [
  ['사용상의 주의사항\n2. 확인 항목', ['2. 확인 항목\n(생략)\n1) 문서의 명칭을 확인한다.\n', {del:'2) 기존 관리번호를 별도로 기재한다.'}, '\n(후략)'], ['2. 확인 항목\n(좌동)\n1) 문서의 명칭을 확인한다.\n—\n(좌동)'], '문단 삭제 · 근거 없음\n변경 사유 기재 필요'],
  ['사용상의 주의사항\n5. 일반적 사항', ['5. 일반적 사항\n(생략)\n—'], ['5. 일반적 사항\n(좌동)\n', {add:'개정 문서에는 검토 완료일을 함께 기록한다.'}], '문단 추가 · 근거 없음\n변경 사유 기재 필요'],
  ['사용상의 주의사항\n13. 적용 기준', ['13. 적용 기준\n1) 이 절차는 정기 검토 시', {del:'에만'}, ' 적용한다.'], ['13. 적용 기준\n1) 이 절차는 정기 검토 시 적용한다.'], '중요 변경 · 적용 범위\n변경 사유 기재 필요']
 ]}
};
function renderSample(key) {
 const body = document.querySelector('#sample-body'); body.replaceChildren();
 examples[key].rows.forEach(row => {
  const tr = document.createElement('tr');
  row.forEach((value, index) => {
   const cell = document.createElement(index === 0 ? 'th' : 'td');
   if (index === 0) cell.scope = 'row';
   if (key === 'rmp' && (index === 1 || index === 2)) {
    const location = document.createElement('strong');
    location.className = 'sample-paragraph';
    location.textContent = row[0];
    cell.append(location);
   }
   if (index === 3) {
    const [classification, ...draft] = value.split('\n');
    const label = document.createElement('span');
    label.className = 'reason-classification';
    label.textContent = classification;
    const text = document.createElement('span');
    text.className = 'reason-draft';
    text.textContent = draft.join('\n');
    cell.append(label, text);
    tr.append(cell);
    return;
   }
   const segments = Array.isArray(value) ? value : [value];
   segments.forEach(segment => {
    if (typeof segment === 'string') { cell.append(document.createTextNode(segment)); return; }
    const removed = Object.hasOwn(segment, 'del');
    const mark = document.createElement(removed ? 'del' : 'ins');
    mark.className = removed ? 'deleted' : 'added';
    mark.textContent = removed ? segment.del : segment.add;
    cell.append(mark);
   });
   tr.append(cell);
  });
  body.append(tr);
 });
 document.querySelector('#sample-caption').textContent = `${examples[key].title} · 항목 / 변경 전 / 변경 후 / 변경 사유`;
 document.querySelectorAll('[data-sample]').forEach(button => { const selected = button.dataset.sample === key; button.classList.toggle('active',selected); button.setAttribute('aria-pressed',String(selected)); });
}
document.querySelectorAll('[data-sample]').forEach(button => button.addEventListener('click', () => renderSample(button.dataset.sample)));
renderSample('rmp');
const before = document.querySelector('#before-pages'); const after = document.querySelector('#after-pages');
function calculate() {
 const output = document.querySelector('#estimate');
 if(!before.value || !after.value || !before.checkValidity() || !after.checkValidity()) { output.textContent = '각 페이지 수를 1~100,000 사이의 정수로 입력해 주세요.'; return; }
 const billablePages = Math.ceil((Number(before.value) + Number(after.value)) / 2);
 const amount = billablePages * 100;
 output.replaceChildren(document.createTextNode('예상 비용 ')); const strong = document.createElement('strong'); strong.textContent = amount.toLocaleString('ko-KR') + '원'; output.append(strong);
}
[before,after].forEach(input => input.addEventListener('input', calculate)); calculate();
document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
 const annual = button.dataset.billing === 'annual';
 document.querySelectorAll('[data-billing]').forEach(item => { const selected = item === button; item.classList.toggle('active',selected); item.setAttribute('aria-pressed',String(selected)); });
 const price = document.querySelector('#subscription-price'); price.replaceChildren(document.createTextNode(annual ? '3,000,000' : '500,000')); const unit = document.createElement('span'); unit.textContent = annual ? '원 / 년' : '원 / 월'; price.append(unit);
 document.querySelector('#subscription-note').textContent = annual ? '연간 결제 · 월 환산 250,000원' : '한 달 단위 구독';
}));


// Hover opens the service submenu; disclosure buttons support touch and keyboard.
const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
function setDropdown(dropdown, open) {
 dropdown.querySelector('.submenu-toggle').setAttribute('aria-expanded', String(open));
 dropdown.querySelector('.nav-submenu').hidden = !open;
}
function closeDropdowns() { dropdowns.forEach(dropdown => setDropdown(dropdown, false)); }
dropdowns.forEach(dropdown => {
 const button = dropdown.querySelector('.submenu-toggle');
 dropdown.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse') return;
  closeDropdowns(); setDropdown(dropdown, true);
 });
 dropdown.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse' && !dropdown.contains(document.activeElement)) setDropdown(dropdown, false);
 });
 button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  closeDropdowns(); setDropdown(dropdown, open);
 });
 dropdown.addEventListener('focusout', event => {
  if (!dropdown.contains(event.relatedTarget)) setDropdown(dropdown, false);
 });
 dropdown.addEventListener('keydown', event => {
  if(event.key === 'Escape') { setDropdown(dropdown, false); button.focus(); event.stopPropagation(); }
  if(event.key === 'ArrowDown' && event.target === button) {
   event.preventDefault(); setDropdown(dropdown, true); dropdown.querySelector('.nav-submenu a').focus();
  }
 });
 dropdown.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDropdowns));
});
document.addEventListener('click', event => { if(!event.target.closest('.nav-dropdown')) closeDropdowns(); });
