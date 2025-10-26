import { useState } from "react";
import authService from "./../appwrite/auth.services";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { login } from "./../features/authSlice";
import { Button, Input, Logo } from "./index.components";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");

    try {
      const userData = await authService.createAccount(data);

      if (userData) {
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          dispatch(login({ userData: currentUser }));
        }

        navigate("/");
      }
    } catch (error) {
      console.error("❌ [ERROR] Error during sign-up:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign Up to create Account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an Account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form
          onSubmit={(e) => {
            handleSubmit(create)(e);
          }}
        >
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your Full Name"
              {...register("name", {
                required: true,
              })}
            />

            <Input
              label="Email: "
              placeholder="Enter Your Email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      value
                    ) || "Email address must be valid",
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your Password"
              {...register("password", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(
                      value
                    ) ||
                    "Password must be at least 8 characters long and include uppercase, lowercase, and special character",
                },
              })}
            />

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
