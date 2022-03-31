import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ItemPic from "./ItemPic";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from './LoadingPage'

const CreateOrEditListing = (props) => {
  //Props passed down to this component will determine whether a listing in question
  //is being edited, or created. If it is being edited, the 'mode' prop will be 'edit'.
  //If it is being created, the 'mode' prop will be 'create'.
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    listed: null,
    itemPicUrl: "",
    itemPicName: "",
  });

  const user = supabase.auth.user();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getItem = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select("name, description, category, listed, image_url, image_name")
          .eq("id", params.id)
          .limit(1)
          .single();
        if (error) throw error;
        if (data) {
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            listed: data.listed,
            itemPicUrl: data.image_url,
            itemPicName: data.image_name,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    /* depending on whether the mode is 'edit' or 'create',
    a listing may be fetched and its info set to local state. */
    if (props.mode === "edit") {
      getItem();
    } else
      setFormData({
        name: "",
        description: "",
        category: "",
        listed: null,
        itemPicUrl: "",
        itemPicName: "",
      });
  }, [props.mode]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fullUrl = supabase.storage
        .from("item-pics")
        .getPublicUrl(formData.itemPicName);
      /* due to how the supabase storage works, a url
      must be generated and set to an item in order for
      the image to properly display. If the url is set to
      the path/file name of the image in storage, the image
      will not properly display. Here, a working url is
      created and placed in the upsert call so that the
      image_url column in the 'items' table has a working url */

      let { data, error } = await supabase.from("items").upsert([
        {
          id: params.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: fullUrl.data.publicURL,
          ownerId: user.id,
          image_name: formData.itemPicName,
          listed: formData.listed,
        },
      ]);

      if (error) {
        throw error;
      }
      if (data) {
        props.mode === "create"
          ? alert("Listing Successfully Created!")
          : alert("Listing Updated Successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFormData({
        name: "",
        description: "",
        category: "",
        itemPicUrl: "",
        itemPicName: "",
      });
      navigate("/myAccount");
    }
  };

  const handleDeleteListing = async (e) => {
    e.preventDefault();

    try {
      let { data, error } = await supabase
        .from("items")
        .delete()
        .eq("id", params.id);

      if (error) throw error;
      if (data) alert("Listing Successfully Deleted!");
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/myAccount");
    }
  };

  return loading ? (<LoadingPage /> ) : (
    <div className="px-[20%] mt-10">
      <form className="" onSubmit={handleSubmit}>
        <ItemPic
          url={formData.itemPicName}
          size={150}
          mode={props.mode}
          onUpload={async (fileName, mode) => {
            if (mode === "edit")
              await supabase.storage
                .from("item-pics")
                .remove([formData.itemPicName]);
            setFormData({ ...formData, itemPicName: fileName });
          }}
          /*this function could probably be defined inside
          the ItemPic component, but this was how it was coded
          in the supabase example, so it hasn't been changed */
        />
        <div className="mb-4 mt-4">
          <label className="block text-gray-700" htmlFor="name">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="name"
            placeholder="What are you selling?"
            required={true}
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="description">
            Description
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="description"
            placeholder="Describe your item"
            required={true}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            className=" shadow border rounded py-2 pl-3 text-gray-700 leading-tight focus:shadow-outline"
            name="category"
            value={formData.value}
            onChange={handleChange}
          >
            <option value={`Arts & Crafts`}>{`Arts & Crafts`}</option>
            <option value="Books">Books</option>
            <option value={`Clothing & Apparel`}>{`Clothing & Apparel`}</option>
            <option value="Collectibles">Collectibles</option>
            <option value="Electronics">Electronics</option>
            <option value={`Food & Drink`}>{`Food & Drink`}</option>
            <option value="Furniture">Furniture</option>
            <option value="Home Decor">Home Decor</option>
            <option
              value={`Music & Musical Instruments`}
            >{`Music & Musical Instruments`}</option>
            <option value={`Makeup & Cosmetics`}>{`Makeup & Cosmetics`}</option>
            <option value={`Office & Workplace`}>{`Office & Workplace`}</option>
            <option value={`Sports & Outdoor`}>{`Sports & Outdoor`}</option>
            <option value={`Tools & Appliances`}>{`Tools & Appliances`}</option>
            <option value={`Toys & Games`}>{`Toys & Games`}</option>
            <option
              value={`Vehicle & Automotive`}
            >{`Vehicle & Automotive`}</option>
            <option
              value={`Video Games & Consoles`}
            >{`Video Games & Consoles`}</option>
            <option value="Other/Misc.">Other/Misc.</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-gray-700">Listing Status</label>
          <div className="flex gap-4">
            <div>
              <input
                name="listed"
                id="listed"
                type="radio"
                value={true}
                onChange={handleChange}
              />
              <label className="text-gray-700 pl-1" htmlFor="listed">
                Listed
              </label>
            </div>

            <div>
              <input
                name="listed"
                id="unlisted"
                type="radio"
                value={false}
                onChange={handleChange}
              />
              <label className="text-gray-700 pl-1" htmlFor="unlisted">
                Unlisted
              </label>
            </div>
          </div>
        </div>

        <button
          className="bg-indigo-500 hover:bg-indigo-400 py-2 px-2 w-full rounded-md text-indigo-50"
          type="submit"
        >
          {props.mode === "edit" ? "Edit Listing" : "Create Listing"}
        </button>
      </form>
      {props.mode === "edit" ? (
        <button
          className="mt-5 bg-indigo-500 hover:bg-indigo-400 py-2 px-2 w-full rounded-md text-indigo-50"
          type="button"
          onClick={handleDeleteListing}
        >
          Delete Listing
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateOrEditListing;
