import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';
import LoadingPage from './LoadingPage';

const DemoAccount = () => {
  const [demoPassword, setDemoPassword] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setDemoPassword(`demo${randomInt()}`);
  }, []);

  const randomInt = () => {
    return Math.floor(Math.random() * 100000);
  };

  /* When this component mounts, it will generate a password that will be used to create a demo account. The password will be 'demo' followed by a randomly generated integer between 1 and 100,000. This password will then also be used for the demo username and demo email. */

  const createDemoAuth = async (e) => {
    e.preventDefault();

    let demoUser; //see comment below this function
    try {
      let { user, error } = await supabase.auth.signUp({
        email: `${demoPassword}@demoacct.com`,
        password: demoPassword,
      });
      if (error) throw error;
      demoUser = user;
    } catch (error) {
      console.error(error);
    } finally {
      createDemoAccount(demoUser.id);
    }
  };

  /* Separating these actions into different functions allows the createDemoAccount function to use closure and get the demoId from the createDemoAuth function. I coded it this way in lieu of using state, because I could not get the state to update before the data was needed in the createDemoAccount function. Defining, and later setting, the demoUser variable inside the createDemoAuth function allowed the use of closure to solve this problem. */

  const createDemoAccount = async (demoId) => {
    try {
      let { error } = await supabase.from('users').upsert(
        {
          id: demoId,
          username: `${demoPassword}`,
        },
        { returning: 'minimal' }
      );
      if (error) throw error;
    } catch (error) {
      console.error(error);
    } finally {
      navigate('/myAccount');
    }
  };

  return demoPassword ? (
    <div className="bg-white shadow-md rounded px-8 pt-0 pb-8 mb-4">
      <button
        className="cursor-pointer mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white w-full hover:bg-indigo-600"
        aria-live="polite"
        onClick={createDemoAuth}
      >
        Create Demo Account
      </button>
    </div>
  ) : (
    <LoadingPage />
  );
};

export default DemoAccount;
