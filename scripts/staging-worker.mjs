export default {async fetch(request,env){
  const url=new URL(request.url);
  if(env.HAQIQ_ENVIRONMENT!=='preview'||!url.hostname.endsWith('-wild-boat-a57c.ncal-hamadah.workers.dev'))return new Response('Not found',{status:404});
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  const response=await env.ASSETS.fetch(request),headers=new Headers(response.headers);
  headers.set('Cache-Control','no-store');headers.set('X-Robots-Tag','noindex, nofollow');headers.set('Referrer-Policy','no-referrer');
  headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://kiptwhbdzddyhjpedooe.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  return new Response(response.body,{status:response.status,headers});
}};
