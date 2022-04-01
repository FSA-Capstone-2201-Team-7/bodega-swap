import React from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../supabaseClient'

const DemoAccount = () => {
  const navigate = useNavigate()
  const randomInt = () => {
    return Math.floor(Math.random() * (100000))
  }
  const createDemoAccount = async (e) => {
    e.preventDefault()
    try {
      let { user, error } = await supabase.auth.signUp({ email: `demoaccount${randomInt()}`, password: `demo${randomInt()}` })
      if (error) throw error
      console.log(user)
    } catch (error) {
      console.error(error)
    }
  }
} 

export default DemoAccount