
import { getToken } from "./users-service"

export default async function sendRequest(url, method = 'GET', payload = null){

  // Fetch uses an options object as a second arg
  // to make requests other than GET, include data,
  // set headers.
  const options = { method }
  if (payload) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(payload)
  }
  const token = getToken()

  if(token){
    //endure the headers objects exists
    options.headers ||= {};
    //add token to an authorisation header
    //prefacing with 'bearer' is recommended in the http specification
    options.headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, options)

  // Check if request was successful
  if (res.ok) return res.json()
  
  throw new Error('Bad Request')

}

