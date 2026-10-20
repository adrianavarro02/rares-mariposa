// Sustituye las tarjetas estáticas por productos activos de Supabase cuando existan.
(async function(){
  if(!window.raresSupabaseReady||!window.raresSupabaseReady()) return;
  const db=window.supabase.createClient(window.RARES_SUPABASE_URL,window.RARES_SUPABASE_ANON_KEY);
  const grid=document.querySelector('#menu .grid'); if(!grid) return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const {data:products,error}=await db.from('products').select('name,description,price,category,image_url,tag,is_featured,is_active,sort_order,created_at').eq('is_active',true).order('sort_order',{ascending:true}).order('created_at',{ascending:true});
  if(error||!products||!products.length)return;
  grid.innerHTML=products.map(p=>`<article class="item" data-category="${esc(p.category)}"><div class="item-image">${p.image_url?`<img loading="lazy" src="${esc(p.image_url)}" alt="${esc(p.name)}">`:''}${p.tag?`<span class="tag">${esc(p.tag)}</span>`:p.is_featured?'<span class="tag">Destacado ★</span>':''}</div><div class="item-content"><div class="item-title"><h3>${esc(p.name)}</h3><span class="price">${esc(window.raresFormatPrice(p.price))}</span></div><p>${esc(p.description)}</p></div></article>`).join('');
  document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));const f=b.dataset.filter;grid.querySelectorAll('.item').forEach(i=>i.hidden=f!=='todos'&&i.dataset.category!==f&&!(f==='estrella'&&i.querySelector('.tag')))}));
  const {data:promos}=await db.from('promotions').select('title,description,image_url,starts_at,ends_at,is_active,created_at').eq('is_active',true).order('created_at',{ascending:false});
  const now=Date.now(), visible=(promos||[]).filter(p=>(!p.starts_at||new Date(p.starts_at).getTime()<=now)&&(!p.ends_at||new Date(p.ends_at).getTime()>=now));
  if(visible.length){const sec=document.createElement('section');sec.className='menu';sec.id='promociones';sec.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="eyebrow">Por tiempo limitado</div><h2>Promociones</h2></div><p>Ofertas especiales de Rares Mariposa.</p></div><div class="grid">${visible.map(p=>`<article class="item">${p.image_url?`<div class="item-image"><img loading="lazy" src="${esc(p.image_url)}" alt="${esc(p.title)}"></div>`:''}<div class="item-content"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div></article>`).join('')}</div></div>`;const visit=document.querySelector('.visit');if(visit)visit.parentNode.insertBefore(sec,visit)}
})();
