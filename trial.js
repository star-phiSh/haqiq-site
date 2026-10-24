(()=>{
  const API_URL='https://bdnjsszeprhztgjlfrdh.supabase.co/functions/v1/request-trial';
  const PUBLISHABLE_KEY='sb_publishable_OThgvmvZiuDB71FSELXAPg_ECqasbOG';
  const dialog=document.getElementById('trial-dialog');
  const form=document.getElementById('trial-form');
  const status=document.getElementById('trial-status');
  const countrySelect=document.querySelector('[data-country-select]');
  const companyField=form?.querySelector('input[name="company"]');
  const workspaceField=form?.querySelector('input[name="requested_slug"]');
  const workspaceMessage=document.getElementById('workspace-address-status');
  let workspaceCustomized=false;
  let checking=0;
  let checkTimer=null;

  const locale=()=>document.documentElement.dataset.lang==='ar'||document.documentElement.lang==='ar'?'ar':'en';

  const reserved=new Set('admin,api,app,assets,auth,billing,blog,cdn,certificate,certificates,dashboard,docs,event,events,help,haqiq,login,logout,mail,marketing,platform,register,signup,static,status,support,verify,www'.split(','));
  const suggest=company=>String(company||'').normalize('NFKD').toLowerCase().replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40).replace(/-+$/,'');
  const addressIssue=slug=>!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)&&slug.length>=3&&slug.length<=40)
    ?(locale()==='ar'?'استخدم 3–40 حرفاً إنجليزياً صغيراً أو رقماً أو شرطة.':'Use 3–40 lowercase letters, numbers or hyphens.')
    :(reserved.has(slug)||slug.startsWith('xn--'))?(locale()==='ar'?'هذا العنوان محجوز.':'This workspace address is reserved.'):null;
  const addressText=(message,ok)=>{if(!workspaceMessage)return;workspaceMessage.textContent=message;workspaceMessage.className='workspace-address-status'+(ok===true?' success':ok===false?' error':'');};
  async function checkAddress(){
    if(!workspaceField)return false;
    const slug=workspaceField.value.trim();
    const id=++checking;
    const issue=addressIssue(slug);
    if(issue){workspaceField.setCustomValidity(issue);addressText(issue,false);return false;}
    workspaceField.setCustomValidity('');
    addressText(locale()==='ar'?'جارٍ التحقق من العنوان…':'Checking address…');
    try{
      const response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':PUBLISHABLE_KEY},body:JSON.stringify({action:'check_workspace_slug',requested_slug:slug})});
      const result=await response.json().catch(()=>({}));
      if(id!==checking||slug!==workspaceField.value.trim())return false;
      if(!response.ok||result.available!==true){
        const message=result.available===false?(locale()==='ar'?'هذا العنوان غير متاح. اختر عنواناً آخر.':'That address is unavailable. Choose another.'):(locale()==='ar'?'تعذر التحقق الآن. حاول مرة أخرى.':'Cannot verify this address right now. Try again.');
        workspaceField.setCustomValidity(message);addressText(message,false);return false;
      }
      workspaceField.setCustomValidity('');
      addressText((locale()==='ar'?'متاح حالياً، ويُحجز بعد تأكيد البريد الإلكتروني.':'Available for now; reserved after email verification.'),true);
      return true;
    }catch{
      if(id!==checking)return false;
      const message=locale()==='ar'?'تعذر التحقق الآن. حاول مرة أخرى.':'Cannot verify this address right now. Try again.';
      workspaceField.setCustomValidity(message);addressText(message,false);return false;
    }
  }
  if(companyField&&workspaceField){
    companyField.addEventListener('input',()=>{if(workspaceCustomized)return;workspaceField.value=suggest(companyField.value);clearTimeout(checkTimer);checkTimer=setTimeout(()=>void checkAddress(),400);});
    workspaceField.addEventListener('input',()=>{workspaceCustomized=true;workspaceField.value=workspaceField.value.toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,40);workspaceField.setCustomValidity('');clearTimeout(checkTimer);checkTimer=setTimeout(()=>void checkAddress(),400);});
    workspaceField.addEventListener('blur',()=>{clearTimeout(checkTimer);void checkAddress();});
  }

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
    clearTimeout(checkTimer);
    if(!await checkAddress()){form.reportValidity();return;}

    const submit=form.querySelector('button[type="submit"]');
    const data=new FormData(form);
    const payload={
      company:String(data.get('company')||'').trim(),
      requested_slug:String(data.get('requested_slug')||'').trim(),
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
      workspaceCustomized=false;
      if(workspaceMessage)addressText('');
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
