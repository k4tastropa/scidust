"use client"

import { Eye, EyeSlash } from "@phosphor-icons/react"
import { useState } from "react"

type PasswordInputProps = {
  autoComplete: "current-password" | "new-password"
  minLength?: number
  name: string
}

export function PasswordInput({
  autoComplete,
  minLength,
  name,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const inputId = `${name}-input`
  const label = isVisible ? "Hide password" : "Show password"

  return (
    <div className="relative">
      <input
        id={inputId}
        name={name}
        type={isVisible ? "text" : "password"}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        className="min-h-12 w-full border border-[#a7e5df]/35 bg-[#061111] py-2 pr-12 pl-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df] focus-visible:ring-2 focus-visible:ring-[#a7e5df]/45"
      />
      <button
        type="button"
        aria-controls={inputId}
        aria-label={label}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute top-1/2 right-1 flex min-h-10 min-w-10 -translate-y-1/2 touch-manipulation items-center justify-center text-[#a7e5df] transition-colors hover:bg-[#a7e5df]/10 hover:text-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none"
      >
        {isVisible ? (
          <EyeSlash aria-hidden="true" size={20} weight="regular" />
        ) : (
          <Eye aria-hidden="true" size={20} weight="regular" />
        )}
        <span className="sr-only">{label}</span>
      </button>
    </div>
  )
}
