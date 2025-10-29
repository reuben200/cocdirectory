export async function fetchJSON(path){
  const res = await fetch(path)
  if(!res.ok) throw new Error('Failed to fetch '+path)
  return res.json()
}
