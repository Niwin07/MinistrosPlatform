const API_BASE = '/api'

export async function getSetlists() {
  const res = await fetch(`${API_BASE}/setlists`)
  return res.json()
}

export async function getSetlist(id) {
  const res = await fetch(`${API_BASE}/setlists/${id}`)
  return res.json()
}

export async function saveSetlist(setlist) {
  const res = await fetch(`${API_BASE}/setlists`, {
    method: setlist.id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(setlist),
  })
  return res.json()
}
