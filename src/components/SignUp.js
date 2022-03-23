import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
    navigate("/addUser");
  };

  return (
    <div className="flex justify-center ">
      <div className="w-2/4" aria-live="polite">
        <h1 className="text-2xl my-5">Bodega Swap</h1>
        {loading ? (
          "Logging in..."
        ) : (
          <div className="w-full max-w-s">
            <p className="mb-5">Create an account</p>
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSignup}
            >
              <div className="mb-4">
                {" "}
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                {" "}
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className=" cursor-pointer mt-5 rounded-lg bg-purple-900 px-4 py-2 text-sm text-white w-full hover:bg-purple-700"
                aria-live="polite"
              >
                Sign up
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
