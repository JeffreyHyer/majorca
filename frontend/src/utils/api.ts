const API_BASE_URL = 'http://localhost:3000/'

export const getJournals = async () => {
  return get('journals')
}

export const getJournal = async (id: string) => {
  return get(`journals/${id}`)
}

export const postJournal = async (data: any) => {
  return post('journals', data)
}

export const putJournal = async (id: string, data: any) => {
  return put(`journals/${id}`, data)
}

export const patchJournal = async (id: string, data: any) => {
  return patch(`journals/${id}`, data)
}

export const getJournalPage = async (journalId: string, pageId: string) => {
  return get(`journals/${journalId}/pages/${pageId}`)
}

export const postJournalPage = async (journalId: string, data: any) => {
  return post(`journals/${journalId}/pages`, data)
}

export const putJournalPage = async (journalId: string, pageId: string, data: any) => {
  return put(`journals/${journalId}/pages/${pageId}`, data)
}

const get = async (url: string) => {
  return fetch(`${API_BASE_URL}${url}`).then(response => response.json())
}

const post = async (url: string, data: any) => {
  return fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
}

const put = async (url: string, data: any) => {
  return fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
}

const patch = async (url: string, data: any) => {
  return fetch(`${API_BASE_URL}${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
}

const del = async (url: string) => {
  return fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE'
  }).then(response => response.json())
}
