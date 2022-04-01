import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../supabaseClient'
import LoadingPage from './LoadingPage'

const DemoAccount = () => {
  let demoUser
  const [demoPassword, setDemoPassword] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setDemoPassword(`demo${randomInt()}`)
  }, [])

  const randomInt = () => {
    return Math.floor(Math.random() * (100000))
  }
  const createDemoAccount = async (e) => {
    e.preventDefault()
    try {
      let { user, error } = await supabase.auth.signUp({ email: `demoaccount${randomInt()}@demoacct.com`, password: [demoPassword] })
      if (error) throw error
      demoUser = user
    } catch (error) {
      console.error(error)
    } finally {
      try {
        console.log(demoUser)
        let { data, error } = await supabase.from('users').upsert({
          id: demoUser.id,
          username: `demoUser${demoPassword}`
        })
        if (error) throw error
      } catch (error) {
        console.error(error)
      } finally {
        await supabase.auth.signIn({
          email: demoUser.email,
          password: demoPassword
        })
      }
    }
  }

  return (
    !demoPassword ? 
    <button type='button' onClick={createDemoAccount}>Demo Account</button>
 : <LoadingPage /> )
} 

export default DemoAccount