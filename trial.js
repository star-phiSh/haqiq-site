(()=>{
  const API_URL='https://bdnjsszeprhztgjlfrdh.supabase.co/functions/v1/request-trial';
  const PUBLISHABLE_KEY='sb_publishable_OThgvmvZiuDB71FSELXAPg_ECqasbOG';
  const dialog=document.getElementById('trial-dialog');
  const form=document.getElementById('trial-form');
  const status=document.getElementById('trial-status');
  const countrySelect=document.querySelector('[data-country-select]');

  const locale=()=>document.documentElement.dataset.lang==='ar'||document.documentElement.lang==='ar'?'ar':'en';

  function populateCountries(){
    if(!countrySelect||countrySelect.options.length>1)return;
    const codes='AW,AF,AO,AI,AX,AL,AD,AE,AR,AM,AS,AQ,TF,AG,AU,AT,AZ,BI,BE,BJ,BQ,BF,BD,BG,BH,BS,BA,BL,BY,BZ,BM,BO,BR,BB,BN,BT,BV,BW,CF,CA,CC,CH,CL,CN,CI,CM,CD,CG,CK,CO,KM,CV,CR,CU,CW,CX,KY,CY,CZ,DE,DJ,DM,DK,DO,DZ,EC,EG,ER,EH,ES,EE,ET,FI,FJ,FK,FR,FO,FM,GA,GB,GE,GG,GH,GI,GN,GP,GM,GW,GQ,GR,GD,GL,GT,GF,GU,GY,HK,HM,HN,HR,HT,HU,ID,IM,IN,IO,IE,IR,IQ,IS,IL,IT,JM,JE,JO,JP,KZ,KE,KG,KH,KI,KN,KR,KW,LA,LB,LR,LY,LC,LI,LK,LS,LT,LU,LV,MO,MF,MA,MC,MD,MG,MV,MX,MH,MK,ML,MT,MM,ME,MN,MP,MZ,MR,MS,MQ,MU,MW,MY,YT,NA,NC,NE,NF,NG,NI,NU,NL,NO,NP,NR,NZ,OM,PK,PA,PN,PE,PH,PW,PG,PL,PR,KP,PT,PY,PS,PF,QA,RE,RO,RU,RW,SA,SD,SN,SG,GS,SH,SJ,SB,SL,SV,SM,SO,PM,RS,SS,ST,SR,SK,SI,SE,SZ,SX,SC,SY,TC,TD,TG,TH,TJ,TK,TM,TL,TO,TT,TN,TR,TV,TW,TZ,UG,UA,UM,UY,US,UZ,VA,VC,VE,VG,VI,VN,VU,WF,WS,YE,ZA,ZM,ZW'.split(',');
    const lang=locale()==='ar'?'ar':'en';
    let display;
    try{display=new Intl.DisplayNames([lang],{type:'region'});}catch{display=null;}
    const nameFor=(code)=>display?.of(code)||code;
    const preferred=['AE','SA'];
    const rest=codes.filter(code=>!preferred.includes(code)).map(code=>({code,name:nameFor(code)})).sort((a,b)=>a.name.localeCompare(b.name,lang));
    const groups=[
      {label:lang==='ar'?'الأكثر استخداماً':'Common',items:preferred.map(code=>({code,name:nameFor(code)}))},
      {label:lang==='ar'?'جميع الدول والمناطق':'All countries and regions',items:rest},
    ];
    for(const group of groups){
      const optgroup=document.createElement('optgroup');
      optgroup.label=group.label;
      for(const item of group.items){
        const option=document.createElement('option');
        option.value=item.name;
        option.textContent=item.name;
        option.dataset.code=item.code;
        optgroup.appendChild(option);
      }
      countrySelect.appendChild(optgroup);
    }
  }

  function openDialog(){
    if(!dialog)return;
    populateCountries();
    if(status){status.className='trial-status';status.textContent='';}
    if(typeof dialog.showModal==='function'){
      if(!dialog.open)dialog.showModal();
    }else{
      dialog.setAttribute('open','');
      dialog.classList.add('trial-fallback-open');
    }
    const first=form?.querySelector('input[name="company"]');
    setTimeout(()=>first?.focus(),0);
  }

  function closeDialog(){
    if(!dialog)return;
    if(typeof dialog.close==='function'&&dialog.open)dialog.close();
    else{
      dialog.removeAttribute('open');
      dialog.classList.remove('trial-fallback-open');
    }
  }

  document.querySelectorAll('[data-trial-open]').forEach(button=>{
    button.addEventListener('click',(event)=>{
      event.preventDefault();
      openDialog();
    });
  });
  document.querySelectorAll('[data-trial-close]').forEach(button=>button.addEventListener('click',closeDialog));
  if(dialog)dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});

  populateCountries();

  if(!form)return;
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    if(!form.reportValidity())return;

    const submit=form.querySelector('button[type="submit"]');
    const data=new FormData(form);
    const payload={
      company:String(data.get('company')||'').trim(),
      name:String(data.get('name')||'').trim(),
      email:String(data.get('email')||'').trim(),
      country:String(data.get('country')||'').trim(),
      website:String(data.get('website')||'').trim(),
      locale:locale()
    };

    if(submit){
      submit.disabled=true;
      submit.textContent=locale()==='ar'?'جارٍ الإرسال…':'Submitting…';
    }
    if(status){
      status.className='trial-status';
      status.textContent=locale()==='ar'?'جارٍ إرسال طلب التجربة…':'Sending your trial request…';
    }

    try{
      const response=await fetch(API_URL,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':PUBLISHABLE_KEY
        },
        body:JSON.stringify(payload)
      });
      const body=await response.json().catch(()=>({}));
      if(!response.ok){
        throw new Error(typeof body.error==='string'?body.error:(locale()==='ar'?'تعذر إرسال الطلب حالياً.':'Unable to submit the trial request right now.'));
      }

      form.reset();
      populateCountries();
      if(status){
        status.className='trial-status success';
        status.textContent=locale()==='ar'
          ? 'تم استلام الطلب. تحقق من بريد العمل للمتابعة.'
          : 'Request received. Check your work email to continue.';
      }
    }catch(error){
      if(status){
        status.className='trial-status error';
        status.textContent=error instanceof Error
          ? error.message
          : (locale()==='ar'?'تعذر إرسال الطلب حالياً.':'Unable to submit the trial request right now.');
      }
    }finally{
      if(submit){
        submit.disabled=false;
        submit.textContent=locale()==='ar'?'طلب التجربة':'Request trial';
      }
    }
  });
})();
