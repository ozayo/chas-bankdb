"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { authState, logout } = useAuth();

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  // useEffect ile bileşen tamamen yüklendikten sonra durumu belirleriz.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Bileşen yüklenmeden önce hiçbir şey render edilmez.
  if (!hasMounted) {
    return null;
  }

  return (
    <header className="py-4 md:py-8 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div className="logo flex-none w-30">
          <Link href="/">
            <span className="font-extrabold">CHAS BANK</span>
          </Link>
        </div>
        <div className="desknav grow hidden md:inline-block">
          <ul className="flex justify-end gap-5 align-middle items-center">
            <li>
              <Link href="/" className="text-gray-800 hover:text-indigo-600 font-bold">Home</Link>
            </li>  
            <li>
              <Link href="#" className="text-gray-800 hover:text-indigo-600 font-bold">About</Link>
            </li>
            {authState.isLoggedIn ? (
              <>
                <li>
                  <Link href="/account" className="text-gray-800 hover:text-indigo-600 font-bold">My Account</Link>
                </li>  
                <li>
                  <button className="bg-black text-white rounded-md px-4 py-2 font-medium" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/create" className="text-gray-800 hover:text-indigo-600 font-bold">Create Account</Link>
                </li>                
                <li>
                  <Link href="/login" className="bg-black text-white rounded-md px-4 py-2 font-medium">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="hamburger md:hidden flex w-10 justify-end" onClick={toggleMobileNav}>
          {isMobileNavOpen ? (
            <FaTimes size="1.5em" />
          ) : (
            <FaBars size="1.5em" />
          )}
        </div>
      </div>
      {/* Mobile menu start */}
      <div 
        className={`${
          isMobileNavOpen
            ? "flex flex-col items-end mt-4 test md:hidden"
            : "hidden md:hidden"
        } justify-end`}
      >
        <ul className="md:flex gap-4">
          <li>
            <Link href="/" className="text-gray-800 hover:text-indigo-600 font-bold">Home</Link>
          </li>  
          <li>
            <Link href="#" className="text-gray-800 hover:text-indigo-600 font-bold">About</Link>
          </li>
          {authState.isLoggedIn ? (
            <>
              <li>
                <Link href="/account" className="text-gray-800 hover:text-indigo-600 font-bold">My Account</Link>
              </li>  
              <li>
                <button className="bg-black text-white rounded-md px-4 py-2 font-medium" onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/create" className="text-gray-800 hover:text-indigo-600 font-bold">Create Account</Link>
              </li>                
              <li>
                <Link href="/login" className="bg-black text-white rounded-md px-4 py-2 font-medium">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
