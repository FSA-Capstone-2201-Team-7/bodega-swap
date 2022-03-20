import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (signUp) {
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Created new account!");
      } else {
        const { user, error } = await supabase.auth.signIn({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">Bodega Swap</h1>
        <p className="description">
          {signUp ? "Create an account" : "Sign in"}
        </p>

        {loading ? (
          "Logging in..."
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button block" aria-live="polite">
              {signUp ? "Sign up" : "Login"}
            </button>
          </form>
        )}
        <button onClick={() => setSignUp(!signUp)}>
          {signUp ? "Already an User" : "Sign Up for a New Account"}
        </button>
      </div>
    </div>
  );
}
