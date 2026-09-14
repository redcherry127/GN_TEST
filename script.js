'use strict';

// Landing-page sample only. No files or personal data are sent to a server.
const samples = {
  procedure: {
    title: '안전관리 절차',
    rows: [
      { item: '확인 절차', before: '담당자가 변경 내용을 확인한다.', after: '담당자가 변경 내용을 확인하고 검토 이력을 기록한다.', type: '수정' },
      { item: '검토 책임', before: '안전관리 담당자', after: '안전관리 담당자 및 부서 책임자', type: '수정' },
      { item: '후속 조치', before: '', after: '검토 결과에 따른 조치 계획을 작성한다.', type: '추가' }
    ]
  },
  document: {
    title: '문서 관리 기준',
    rows: [
      { item: '문서 식별', before: '문서명을 기재한다.', after: '문서명, 버전 및 개정일을 기재한다.', type: '수정' },
      { item: '배포 방식', before: '인쇄본을 부서별로 배포한다.', after: '', type: '삭제' },
      { item: '변경 이력', before: '', after: '개정 사유와 승인자를 변경 이력에 기록한다.', type: '추가' }
    ]
  }
};

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();

const sampleSelect = document.querySelector('#sample');
const emptyState = document.querySelector('#demo-empty');
const result = document.querySelector('#demo-result');
const resultBody = document.querySelector('#result-body');
let displayedSample = null;

sampleSelect.addEventListener('change', () => {
  const sample = samples[sampleSelect.value];
  document.querySelector('#before-name').textContent = `${sample.title}_v1`;
  document.querySelector('#after-name').textContent = `${sample.title}_v2`;
  emptyState.hidden = false;
  result.hidden = true;
  displayedSample = null;
});

document.querySelector('#compare').addEventListener('click', () => {
  displayedSample = samples[sampleSelect.value];
  resultBody.replaceChildren();
  for (const row of displayedSample.rows) {
    const tr = document.createElement('tr');
    for (const [key, value] of Object.entries(row)) {
      const td = document.createElement('td');
      const span = document.createElement('span');
      span.textContent = value || '—';
      if (key === 'before' && value) span.className = 'deleted';
      if (key === 'after' && value) span.className = 'added';
      if (key === 'type') span.className = `status-badge ${value === '추가' ? 'new' : value === '삭제' ? 'remove' : ''}`;
      td.append(span);
      tr.append(td);
    }
    resultBody.append(tr);
  }
  emptyState.hidden = true;
  result.hidden = false;
  document.querySelector('#result-summary').textContent = `${displayedSample.title} · 변경 ${displayedSample.rows.length}건 · 가상 예시`;
});

document.querySelector('#download').addEventListener('click', () => {
  if (!displayedSample) return;
  const escapeCell = value => `"${String(value).replace(/"/g, '""')}"`;
  const rows = [
    ['가상 예시 — 실제 규정이 아니며 제출용으로 사용할 수 없습니다.'],
    ['항목', '개정 전', '개정 후', '구분'],
    ...displayedSample.rows.map(row => [row.item, row.before, row.after, row.type])
  ];
  const csv = '\uFEFF' + rows.map(row => row.map(escapeCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `레그노트_${displayedSample.title}_변경대비표_샘플.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
