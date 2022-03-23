import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
    navigate("/home");
  };

  return (
    <div className="flex justify-center ">
      <div className="w-2/4" aria-live="polite">
        <h1 className="text-2xl my-5">Bodega Swap</h1>

        {loading ? (
          "Logging in..."
        ) : (
          <div className="w-full max-w-s">
            <p className="mb-5">Log in</p>
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleLogin}
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
                  placeholder="Your email"
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
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end  ">
                <h3 className="text-purple-900 cursor-pointer">
                  Forgot Password?
                </h3>
              </div>

              <button
                className=" cursor-pointer mt-5 rounded-lg bg-purple-900 px-4 py-2 text-sm text-white w-full hover:bg-purple-700"
                aria-live="polite"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
