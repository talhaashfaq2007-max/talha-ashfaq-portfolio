'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const skills = [
    ['Python', /\bpython\b/i], ['C++', /\bc\+\+(?=\W|$)|\bcpp\b/i], ['JavaScript', /\bjavascript\b|\bjs\b/i],
    ['HTML', /\bhtml5?\b/i], ['CSS', /\bcss3?\b/i], ['React', /\breact(?:\.js)?\b/i],
    ['Node.js', /\bnode(?:\.js)?\b/i], ['SQL', /\bsql\b/i], ['PostgreSQL', /\bpostgres(?:ql)?\b/i],
    ['MongoDB', /\bmongodb\b/i], ['FastAPI', /\bfastapi\b/i], ['Django', /\bdjango\b/i],
    ['Flask', /\bflask\b/i], ['Git', /\bgit\b/i], ['GitHub', /\bgithub\b/i],
    ['Linux', /\blinux\b/i], ['Docker', /\bdocker\b/i], ['REST API', /\brest(?:ful)?\s*api\b|\bapis?\b/i],
    ['Machine Learning', /\bmachine learning\b/i], ['Artificial Intelligence', /\bartificial intelligence\b|\bai\b/i],
    ['Data Analysis', /\bdata analysis\b|\bpandas\b/i], ['NumPy', /\bnumpy\b/i],
    ['Problem Solving', /\bproblem solving\b/i], ['Communication', /\bcommunication\b/i],
    ['Teamwork', /\bteamwork\b|\bteam collaboration\b/i], ['Microsoft Excel', /\bexcel\b/i],
    ['AWS', /\baws\b|\bamazon web services\b/i], ['Azure', /\bazure\b/i], ['Cybersecurity', /\bcybersecurity\b/i]
  ];
  let lastReport = '';
  let mode = 'text';
  $('#text-tab').addEventListener('click', () => switchMode('text'));
  $('#pdf-tab').addEventListener('click', () => switchMode('pdf'));
  function switchMode(next) {
    mode = next;
    $('#text-tab').setAttribute('aria-selected', String(mode === 'text'));
    $('#pdf-tab').setAttribute('aria-selected', String(mode === 'pdf'));
    $('#text-panel').classList.toggle('hide', mode !== 'text');
    $('#pdf-panel').classList.toggle('hide', mode !== 'pdf');
    $('#error').textContent = '';
  }
  $('#job').addEventListener('input', e => { $('#counter').textContent = e.target.value.length; });
  function compare(resume, description) {
    const required = skills.filter(([,r]) => r.test(description)).map(([name])=>name);
    const matched = required.filter(name => skills.find(s=>s[0]===name)[1].test(resume));
    return { required, matched, missing: required.filter(s=>!matched.includes(s)), score:required.length?Math.round(100*matched.length/required.length):0 };
  }
  function putChips(container, arr, missing=false) {
    container.replaceChildren();
    if(!arr.length){ const el=document.createElement('span');el.textContent='No keywords detected';container.append(el);return; }
    arr.forEach(s=>{const chip=document.createElement('span');chip.textContent=s;if(missing)chip.className='missing';container.append(chip);});
  }
  function show(result){
    $('#placeholder').classList.add('hide'); $('#results').classList.remove('hide');
    $('#score').textContent = result.score+'%';
    $('#ring').style.strokeDashoffset=String(289*(1-result.score/100));
    putChips($('#matched'),result.matched);putChips($('#missing'),result.missing,true);
    $('#recommendation').textContent=result.required.length?`Detected ${result.required.length} skill keyword(s) in the job description. Review unmatched skills and add truthful relevant experience only.`:'No recognized skills found in the job description. Try adding more explicit skill requirements.';
    lastReport=['CareerLens — keyword matching report','Not an official ATS or AI score.',`Estimated skill match: ${result.score}%`,'',`Required keywords: ${result.required.join(', ')||'None detected'}`,`Matched: ${result.matched.join(', ')||'None'}`,`Not found: ${result.missing.join(', ')||'None'}`,'', 'Only list skills you genuinely have.'].join('\n');
  }
  $('#form').addEventListener('submit',async e=>{
    e.preventDefault();$('#error').textContent='';const jd=$('#job').value.trim();if(!jd)return;
    const button=$('#analyze');button.disabled=true;button.textContent='Analyzing...';
    try {
      let result;
      if(mode==='text') {
        const resume=$('#resume-text').value.trim();if(!resume)throw Error('Paste some resume text first.');
        result=compare(resume,jd);
      } else {
        const file=$('#resume-file').files[0];if(!file)throw Error('Choose a PDF resume first.');
        if(file.size>5*1024*1024)throw Error('PDF must be 5 MB or smaller.');
        const form=new FormData();form.append('resume',file);form.append('description',jd);
        let response;
        try{response=await fetch('http://127.0.0.1:8000/analyze',{method:'POST',body:form});}
        catch{throw Error('Local FastAPI backend is not reachable. Start it using the setup instructions, or switch to paste-text mode.');}
        const data=await response.json();if(!response.ok)throw Error(data.detail||'Unable to process this PDF.');
        result=data;
      }
      show(result);
    } catch(err) { $('#error').textContent=err.message||'Unable to analyze.'; }
    finally{button.disabled=false;button.textContent='Analyze skill keywords ↗';}
  });
  $('#report').addEventListener('click',()=>{if(!lastReport)return;const blob=new Blob([lastReport],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='careerlens-report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
