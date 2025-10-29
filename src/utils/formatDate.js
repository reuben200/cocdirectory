export function formatDateISO(dateStr){
  try{ const d = new Date(dateStr); return d.toLocaleString(); }catch(e){return dateStr}
}