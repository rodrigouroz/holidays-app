export default async function fetchAPI(...args) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(...args, { headers });

  if (!res.ok) {
    throw new Error('Fetch API was not ok');
  }

  const json = await res.json();

  return json;
}
