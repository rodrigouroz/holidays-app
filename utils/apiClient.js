export default async function fetchAPI(...args) {
  const headers = { 'Content-Type': 'application/json' }

  const res = await fetch(...args, { headers })

  const json = await res.json()
  
  return json
}