"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/sign-in", // Optional: redirect to sign-in page after logout
    });
  };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <a 
          className="text-xl font-bold mb-4 sm:mb-0 text-center sm:text-left" 
          href="#"
        >
          Anonym Message
        </a>
        
        {session ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <span className="text-sm sm:text-base text-center sm:text-left">
              Welcome, {user.username || user.email}
            </span>
            <Button 
              onClick={handleLogout} 
              className="w-full sm:w-auto min-w-[100px]"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto min-w-[100px]">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;