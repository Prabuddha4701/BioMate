"use client";
import React from "react";
import Link from "next/link";
import { SunIcon, MoonIcon } from "./NavbarIcons";
import {
  logoTitle,
  logoSub,
  toggleBtn,
  navBtn,
  Header,
} from "../styles/styleclass";

import { useTheme } from "@/context/context";
import Image from "next/image";
import biomate from "../../assests/biomate.ico";
function Navbar() {
  const { dark, setDark } = useTheme();

  return (
    <header className={`${Header(dark)} shrink-0`}>
      <div className="flex items-center gap-3">
        <Image src={biomate} alt="BioMate Logo" width={34} height={34} />

        <div className="flex flex-row  gap-3">
          <div>
            <div className={logoTitle(dark)}>BioMate</div>
            <div className={logoSub(dark)}>
              Chat with A/L Biology Resource books
            </div>
          </div>
          <div>
            <button
              className={toggleBtn(dark)}
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:justify-start">
        <Link href="/about" className={navBtn(dark)}>
          About
        </Link>
        <Link href="/feedback" className={navBtn(dark)}>
          Feedback
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
