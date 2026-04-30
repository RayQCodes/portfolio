import React from 'react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl justify-between px-6 py-4">
        <div className="font-semibold">Raymond Quan</div>

        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
   
        </nav>
      </div>
    </header>
  )
}