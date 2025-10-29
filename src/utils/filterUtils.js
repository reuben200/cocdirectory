export function filterCongregations(list, {search='', country=''}){
  let out = [...list]
  if(country) out = out.filter(c=> c.country===country)
  if(search) out = out.filter(c=> (c.name || c.congregation_name || '').toLowerCase().includes(search.toLowerCase()))
  return out
}
