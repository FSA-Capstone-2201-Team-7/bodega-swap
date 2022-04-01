import React, { useState } from 'react';
import signup from '../../../tutorialPics/desktopTutorial/signup.png';
import signupGif from '../../../tutorialPics/desktopTutorial/signupgif.gif';
import createaccountgif from '../../../tutorialPics/desktopTutorial/createaccountgif.gif';

const DesktopSignup = () => {
  return (
    <div>
      <div>
        <p>
          Our community is built on trust, so in order to trade, you need to
          create an account. Creating an account is easy! Just click on the
          Login button in the top right-hand corner of your screen
        </p>
        <img src={signup} alt="" />
      </div>
      <div>
        <p>
          Next, enter the email you want to use to signup in the email field,
          and the password you want to use in the pass word field and click Sign
          Up
        </p>
        <img src={signupGif} alt="" />
      </div>
      <div>
        <p>
          You will be taken to a screen where you can upload a profile picture
          and create your username.
        </p>
        <img src={createaccountgif} alt="" />
      </div>
    </div>
  );
};

export default DesktopSignup;
