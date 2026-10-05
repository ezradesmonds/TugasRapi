'use strict';
const $ = selector => document.querySelector(selector);
const key = 'tugasrapi.tasks.v1';
let tasks = [], filter = 'all', editing = null, deleting = null, storageBroken = false;
const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && localDate(new Date(`${value}T12:00:00`)) === value;
const validTask = task => task && typeof task.id === 'string' && typeof task.title === 'string' && task.title.trim().length > 0 && task.title.length <= 120 && typeof task.course === 'string' && task.course.trim().length > 0 && task.course.length <= 80 && validDate(task.deadline) && ['low','medium','high'].includes(task.priority) && typeof task.done === 'boolean' && typeof task.notes === 'string' && task.notes.length <= 500;
function announce(message) { $('#notice').textContent = message; }
try {
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(validTask) || new Set(parsed.map(t => t.id)).size !== parsed.length) throw new Error('Data invalid');
    tasks = parsed;
  }
} catch {
  storageBroken = true;
  announce('Data tersimpan tidak bisa dibaca. Data lama tidak ditimpa; periksa penyimpanan browser atau gunakan browser lain.');
}
function save(next) {
  if (storageBroken) { announce('Penyimpanan bermasalah. Perubahan belum disimpan; gunakan browser lain atau periksa data browser.'); return false; }
  try { localStorage.setItem(key, JSON.stringify(next)); tasks = next; return true; }
  catch { announce('Tidak bisa menyimpan. Penyimpanan browser penuh atau dibatasi. Data sebelumnya tetap dipertahankan.'); return false; }
}
const late = task => !task.done && task.deadline < localDate();
const dateLabel = value => new Date(`${value}T12:00:00`).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'});
function element(tag, className, text) { const node = document.createElement(tag); if(className) node.className = className; if(text !== undefined) node.textContent = text; return node; }
function action(label, icon, handler) {
  const button = element('button'); button.type = 'button'; button.setAttribute('aria-label', label); button.title = label;
  // Fixed icon markup only; user input always goes through textContent.
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
  button.addEventListener('click', handler); return button;
}
function render() {
  const today = localDate(); const until = new Date(); until.setDate(until.getDate()+3);
  $('#active-count').textContent = tasks.filter(t => !t.done).length;
  $('#near-count').textContent = tasks.filter(t => !t.done && t.deadline >= today && t.deadline <= localDate(until)).length;
  $('#late-count').textContent = tasks.filter(late).length;
  $('#done-count').textContent = tasks.filter(t => t.done).length;
  $('#total').textContent = tasks.length;
  const query = $('#search').value.trim().toLocaleLowerCase('id');
  const priority = {high:0,medium:1,low:2};
  const shown = tasks.filter(t => (filter === 'all' || filter === 'active' && !t.done || filter === 'done' && t.done || filter === 'late' && late(t)) && `${t.title} ${t.course}`.toLocaleLowerCase('id').includes(query)).sort((a,b) => Number(a.done)-Number(b.done) || ($('#sort').value === 'priority' ? priority[a.priority]-priority[b.priority] : 0) || a.deadline.localeCompare(b.deadline));
  const list = $('#tasks'); list.replaceChildren();
  if (!shown.length) {
    const empty = element('div','empty'); empty.append(element('div','empty-icon','▤'),element('h3','',tasks.length ? 'Tidak ada tugas yang cocok' : 'Agenda kosong, pikiran lega.'),element('p','',tasks.length ? 'Coba kata pencarian atau filter lain.' : 'Tambah tugas pertamamu, atau coba data contoh untuk melihat cara kerjanya.'));
    if (!tasks.length) { const button = element('button','primary','＋ Tambah tugas pertama'); button.addEventListener('click',()=>openEditor()); empty.append(button); }
    list.append(empty); return;
  }
  for (const task of shown) {
    const row = element('article',`task${task.done ? ' completed' : ''}`); row.dataset.id = task.id;
    const check = element('input'); check.type='checkbox'; check.checked=task.done; check.setAttribute('aria-label',`Tandai ${task.title} ${task.done?'belum selesai':'selesai'}`);
    check.addEventListener('change',()=>{ if(save(tasks.map(t=>t.id===task.id?{...t,done:check.checked}:t))) announce(check.checked?'Tugas selesai. Kerja bagus!':'Tugas ditandai aktif.'); render(); });
    const details = element('div'); details.append(element('h3','',task.title),element('p','',task.course)); if(task.notes) details.append(element('p','notes',task.notes));
    const rank = element('div','priority'); rank.append(element('span',`badge ${task.priority}`,{high:'↑ Tinggi',medium:'– Sedang',low:'↓ Rendah'}[task.priority]));
    const deadline = element('div',`deadline${late(task)?' overdue':''}`,dateLabel(task.deadline)); deadline.append(element('small','',task.done?'Selesai':late(task)?'Lewat deadline':task.deadline===today?'Hari ini':'Deadline'));
    const actions = element('div','actions'); actions.append(action(`Edit ${task.title}`,'<path d="m15 4 5 5-11 11H4v-5zM13 6l5 5"/>',()=>openEditor(task)), action(`Hapus ${task.title}`,'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',()=>{deleting=task.id;$('#delete-title').textContent=task.title;$('#delete-dialog').showModal();$('#delete-cancel').focus();}));
    row.append(check,details,rank,deadline,actions); list.append(row);
  }
}
function openEditor(task) {
  editing = task?.id ?? null; const form = $('#task-form'); form.reset(); $('#form-error').textContent='';
  $('#form-title').textContent = task ? 'Edit tugas' : 'Tambah tugas';
  for (const name of ['title','course','deadline','priority','notes']) form.elements[name].value = task?.[name] ?? (name==='priority'?'medium':name==='deadline'?localDate():'');
  form.elements.done.checked=task?.done ?? false; $('#editor').showModal(); form.elements.title.focus();
}
$('#add').addEventListener('click',()=>openEditor());
for(const id of ['close','cancel']) $(`#${id}`).addEventListener('click',()=>$('#editor').close());
$('#task-form').addEventListener('submit',event=>{
  event.preventDefault(); const form=event.currentTarget;
  const task={id:editing??crypto.randomUUID(),title:form.elements.title.value.trim(),course:form.elements.course.value.trim(),deadline:form.elements.deadline.value,priority:form.elements.priority.value,notes:form.elements.notes.value.trim(),done:form.elements.done.checked};
  if(!validTask(task)){ $('#form-error').textContent='Isi judul, mata kuliah, dan tanggal yang valid.'; return; }
  const next=editing?tasks.map(t=>t.id===editing?task:t):[...tasks,task];
  if(save(next)){ $('#editor').close(); announce(editing?'Perubahan tugas disimpan.':'Tugas baru disimpan.'); render(); }
  else $('#form-error').textContent='Tugas belum tersimpan. Periksa pesan penyimpanan pada halaman.';
});
$('#delete-cancel').addEventListener('click',()=>$('#delete-dialog').close());
$('#delete-confirm').addEventListener('click',()=>{if(save(tasks.filter(t=>t.id!==deleting))){$('#delete-dialog').close();announce('Tugas dihapus.');render();}});
for(const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click',()=>{filter=button.dataset.filter;for(const tab of document.querySelectorAll('[data-filter]'))tab.setAttribute('aria-pressed',String(tab===button));render();});
$('#search').addEventListener('input',render);$('#sort').addEventListener('change',render);
$('#demo').addEventListener('click',()=>{
  if(tasks.length){announce('Data contoh hanya ditambahkan saat agenda kosong agar tidak bercampur dengan tugasmu.');return;}
  const relativeDate=days=>{const date=new Date();date.setDate(date.getDate()+days);return localDate(date);};
  const examples=[['Laporan percobaan coding agent','Generative AI',1,'high',false,'Sertakan screenshot hasil dan catatan penggunaan AI.'],['Wireframe aplikasi kelompok','Interaksi Manusia & Komputer',3,'medium',false,'Siapkan alur utama sebelum pertemuan kelompok.'],['Revisi proposal proyek','Manajemen Proyek',-1,'high',false,'Periksa kembali pembagian tugas dan timeline.'],['Latihan query SQL','Basis Data',5,'low',false,'Kerjakan latihan JOIN dan GROUP BY.'],['Ringkasan materi minggu ini','Generative AI',-2,'medium',true,'Catatan sudah dirapikan.']].map(([title,course,days,priority,done,notes])=>({id:crypto.randomUUID(),title,course,deadline:relativeDate(days),priority,done,notes}));
  if(save(examples)){announce('Data contoh ditambahkan. Kamu bisa mengedit atau menghapusnya.');render();}
});
$('#today').textContent = new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase();
window.addEventListener('focus',render);
render();
