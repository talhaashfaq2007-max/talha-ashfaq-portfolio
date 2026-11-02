'use strict';
(() => {
  const key = 'talha-attendx-v2';
  const $ = x => document.querySelector(x);
  let state = {students:[],attendance:{}};
  try { const s = JSON.parse(localStorage.getItem(key)); if (s && Array.isArray(s.students) && typeof s.attendance === 'object' && s.attendance) state=s; } catch {}
  const today = new Date(); const localToday = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  $('#date').value = localToday;
  let editing = null;
  function persist(){try{localStorage.setItem(key,JSON.stringify(state));}catch{alert('Storage is unavailable or full. Your changes may not persist.');}}
  const td=(tr,value)=>{const cell=document.createElement('td');cell.textContent=String(value === '' || value === null || value === undefined ? '—' : value);tr.append(cell);return cell;};
  function button(label,action,cls='btn btn-outline'){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=cls;b.addEventListener('click',action);return b;}
  const statuses=['Unmarked','Present','Absent','Late'];
  function render(){
    const selected=$('#date').value;
    $('#student-rows').replaceChildren(); $('#attendance-rows').replaceChildren(); $('#report-rows').replaceChildren();
    const search=$('#search').value.trim().toLowerCase();
    const displayed=state.students.filter(s=>(s.id+' '+s.name).toLowerCase().includes(search));
    displayed.forEach(s=>{
      const tr=document.createElement('tr'); td(tr,s.id);td(tr,s.name);td(tr,s.email);td(tr,s.department);td(tr,s.semester);
      const actions=document.createElement('td');actions.className='actions';
      actions.append(button('Edit',()=>openForm(s.id)),button('Delete',()=>removeStudent(s.id),'btn btn-danger'));tr.append(actions);$('#student-rows').append(tr);
    });
    $('#count').textContent=`${state.students.length} students`;
    $('#empty-students').classList.toggle('hide',state.students.length>0);
    const day=state.attendance[selected]||{};
    state.students.forEach(s=>{
      const tr=document.createElement('tr');td(tr,s.id);td(tr,s.name);
      const cell=document.createElement('td');
      const sel=document.createElement('select');sel.className='attendance-control';sel.dataset.student=s.id;sel.setAttribute('aria-label',`Attendance status for ${s.name}`);
      statuses.forEach(status=>{const op=document.createElement('option');op.value=status;op.textContent=status;sel.append(op);});sel.value=day[s.id]||'Unmarked';cell.append(sel);tr.append(cell);$('#attendance-rows').append(tr);
    });
    $('#empty-attendance').classList.toggle('hide',state.students.length>0);
    const countPresent=state.students.filter(s=>day[s.id]==='Present').length;
    const countAbsent=state.students.filter(s=>day[s.id]==='Absent').length;
    const countLate=state.students.filter(s=>day[s.id]==='Late').length;
    const marked=countPresent+countAbsent+countLate;
    $('#total').textContent=state.students.length;$('#present').textContent=countPresent;$('#absent').textContent=countAbsent;$('#rate').textContent=marked?`${Math.round(100*countPresent/marked)}%`:'—';
    let hasData=false;
    state.students.forEach(s=>{
      const counts={Present:0,Absent:0,Late:0};
      Object.values(state.attendance).forEach(day=>{const status=day[s.id];if(status in counts)counts[status]++;});
      const total=counts.Present+counts.Absent+counts.Late;
      if(total)hasData=true;
      const tr=document.createElement('tr');td(tr,s.name);td(tr,counts.Present);td(tr,counts.Absent);td(tr,counts.Late);td(tr,total?Math.round(100*counts.Present/total)+'%':'—');$('#report-rows').append(tr);
    });
    $('#empty-reports').classList.toggle('hide',hasData);
    $('#save-state').textContent='';
  }
  function openForm(id=null){editing=id;const s=state.students.find(s=>s.id===id);$('#student-form').classList.remove('hide');$('#form-title').textContent=s?'Edit student':'Add a student';$('#sid').value=s?.id||'';$('#sid').disabled=Boolean(s);$('#sname').value=s?.name||'';$('#semail').value=s?.email||'';$('#dept').value=s?.department||'';$('#semester').value=s?.semester||'3';$('#student-form').scrollIntoView({behavior:'smooth',block:'center'});$('#sname').focus();}
  function closeForm(){$('#student-form').classList.add('hide');editing=null;}
  function removeStudent(id){if(!confirm(`Remove student ${id} and their saved attendance?`))return;state.students=state.students.filter(s=>s.id!==id);Object.values(state.attendance).forEach(day=>delete day[id]);persist();render();}
  $('#add').addEventListener('click',()=>openForm());$('#cancel').addEventListener('click',closeForm);
  $('#student-form').addEventListener('submit',e=>{
    e.preventDefault();const id=$('#sid').value.trim(),name=$('#sname').value.trim();
    if(!id||!name)return;
    if(!editing&&state.students.some(s=>s.id.toLowerCase()===id.toLowerCase()))return alert('Student ID already exists.');
    const s={id:editing||id,name,email:$('#semail').value.trim(),department:$('#dept').value.trim(),semester:$('#semester').value};
    if(editing){const ix=state.students.findIndex(s=>s.id===editing);if(ix>=0)state.students[ix]=s;}else{state.students.push(s);}
    persist();closeForm();render();
  });
  $('#search').addEventListener('input',render);$('#date').addEventListener('change',render);
  $('#save-attendance').addEventListener('click',()=>{
    if(!state.students.length){alert('Add students first.');return;}
    const date=$('#date').value;if(!date)return;
    const day={};document.querySelectorAll('[data-student]').forEach(sel=>{if(sel.value!=='Unmarked')day[sel.dataset.student]=sel.value;});
    if(Object.keys(day).length)state.attendance[date]=day;else delete state.attendance[date];
    persist();render();$('#save-state').textContent='Saved in this browser ✓';
  });
  $('#sample').addEventListener('click',()=>{
    const examples=[{id:'CS-101',name:'Ayesha Khan',email:'ayesha@example.com',department:'Computer Science',semester:'3'},{id:'CS-102',name:'Ali Raza',email:'ali@example.com',department:'Computer Science',semester:'3'},{id:'CS-103',name:'Hassan Malik',email:'hassan@example.com',department:'Computer Science',semester:'3'}];
    let added=0;examples.forEach(s=>{if(!state.students.some(t=>t.id===s.id)){state.students.push(s);added++;}});if(!added)alert('Sample student records are already present.');persist();render();
  });
  function csvCell(s){let str=String(s??'');if(/^[\s]*[=+@-]/.test(str))str="'"+str;return '"'+str.replaceAll('"','""')+'"';}
  $('#export').addEventListener('click',()=>{
    const rows=[['Student ID','Name','Present','Absent','Late','Attendance Rate']];
    state.students.forEach(s=>{const count={Present:0,Absent:0,Late:0};Object.values(state.attendance).forEach(day=>{if(day[s.id] in count)count[day[s.id]]++;});const total=count.Present+count.Absent+count.Late;rows.push([s.id,s.name,count.Present,count.Absent,count.Late,total?Math.round(count.Present/total*100)+'%':'—']);});
    const blob=new Blob([rows.map(row=>row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='attendx-report.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  render();
})();
