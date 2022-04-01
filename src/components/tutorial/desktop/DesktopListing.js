import React from 'react';
import listitem from '../../../tutorialPics/desktopTutorial/listitem.png';
import createlisting from '../../../tutorialPics/desktopTutorial/createlisting.gif';
import profilenav from '../../../tutorialPics/desktopTutorial/profilenav.png';
import editlistingnav from '../../../tutorialPics/desktopTutorial/editlistingnav.png';
import deletelisting from '../../../tutorialPics/desktopTutorial/deletelisting.png';

const DesktopListing = () => {
  return (
    <div>
      <div>
        <p>
          To list an item that you'd like to swap, click on the 'List an Item'
          button in the upper right hand corner.
        </p>
        <img src={listitem} alt="" />
      </div>
      <div>
        <p>
          From here, you can upload a picture of your item, enter a name and
          description, choose a category, and choose whether or not you want
          your item to be publically listed.
        </p>
        <img src={createlisting} alt="" />
      </div>
      <div>
        <p>
          If you want to edit your listing, or change the listing status,
          navigate to your profile:
        </p>
        <img src={profilenav} alt="" />
        <p>
          And click on the Edit Listing button next to the listing you want to
          edit.
        </p>
        <img src={editlistingnav} alt="" />
        <p>
          This will take you to a form where you can edit anything about your
          listing. Click 'Edit Listing' to finalize your edit.
        </p>
      </div>
      <div>
        <p>
          You can also delete your listing from this form. BE CAREFUL!!!! If you
          delete a listing, it will be gone for good!
        </p>
        <img src={deletelisting} alt="" />
      </div>
    </div>
  );
};

export default DesktopListing;
