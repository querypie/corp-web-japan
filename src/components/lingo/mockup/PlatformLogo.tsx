export function PlatformLogo({
  platform,
}: {
  platform: "googleMeet" | "zoom" | "teams"
}) {
  if (platform === "googleMeet") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 87.5 72"
        className="h-3.5 w-3.5 shrink-0"
      >
        <path
          fill="#00832d"
          d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"
        />
        <path
          fill="#0066da"
          d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"
        />
        <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
        <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
        <path
          fill="#00ac47"
          d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"
        />
        <path
          fill="#ffba00"
          d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"
        />
      </svg>
    )
  }

  if (platform === "zoom") {
    // Zoom icon: blue rounded square + white video camera
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-3.5 w-3.5 shrink-0"
      >
        <rect width="32" height="32" rx="6" fill="#4a8cff" />
        {/* camera body */}
        <path
          fill="#fff"
          d="M6 12a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8z"
        />
        {/* camera lens wing */}
        <path fill="#4a8cff" d="M22 13.8l7-4.8v14l-7-4.8V13.8z" />
        <rect x="8" y="11" width="10" height="10" rx="1.5" fill="#4a8cff" />
      </svg>
    )
  }

  // MS Teams 2025 icon (gradient IDs prefixed with "pl-t-" to avoid conflicts)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="4 4 36 38"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path
        fill="url(#pl-t-a)"
        d="M21.9999 20h12c3.3137 0 6 2.6863 6 6v10c0 3.3137-2.6863 6-6 6s-6-2.6863-6-6V26c0-3.3137-2.6863-6-6-6"
      />
      <path
        fill="url(#pl-t-b)"
        d="M7.99988 24c0-3.3137 2.68632-6 6.00002-6h8c3.3137 0 6 2.6863 6 6v12c0 3.3137 2.6863 6 6 6l-16.0001-.0001c-5.5228 0-9.99992-4.4771-9.99992-10z"
      />
      <path
        fill="url(#pl-t-c)"
        fillOpacity=".7"
        d="M7.99988 24c0-3.3137 2.68632-6 6.00002-6h8c3.3137 0 6 2.6863 6 6v12c0 3.3137 2.6863 6 6 6l-16.0001-.0001c-5.5228 0-9.99992-4.4771-9.99992-10z"
      />
      <path
        fill="url(#pl-t-d)"
        fillOpacity=".7"
        d="M7.99988 24c0-3.3137 2.68632-6 6.00002-6h8c3.3137 0 6 2.6863 6 6v12c0 3.3137 2.6863 6 6 6l-16.0001-.0001c-5.5228 0-9.99992-4.4771-9.99992-10z"
      />
      <path
        fill="url(#pl-t-e)"
        d="M32.9999 18c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5"
      />
      <path
        fill="url(#pl-t-f)"
        fillOpacity=".46"
        d="M32.9999 18c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5"
      />
      <path
        fill="url(#pl-t-g)"
        fillOpacity=".4"
        d="M32.9999 18c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5"
      />
      <path
        fill="url(#pl-t-h)"
        d="M17.9999 16c3.3137 0 6-2.6863 6-6 0-3.31371-2.6863-6-6-6s-6 2.68629-6 6c0 3.3137 2.6863 6 6 6"
      />
      <path
        fill="url(#pl-t-i)"
        fillOpacity=".6"
        d="M17.9999 16c3.3137 0 6-2.6863 6-6 0-3.31371-2.6863-6-6-6s-6 2.68629-6 6c0 3.3137 2.6863 6 6 6"
      />
      <path
        fill="url(#pl-t-j)"
        fillOpacity=".5"
        d="M17.9999 16c3.3137 0 6-2.6863 6-6 0-3.31371-2.6863-6-6-6s-6 2.68629-6 6c0 3.3137 2.6863 6 6 6"
      />
      <rect width="16" height="16" x="4" y="23" fill="url(#pl-t-k)" rx="3.25" />
      <rect
        width="16"
        height="16"
        x="4"
        y="23"
        fill="url(#pl-t-l)"
        fillOpacity=".7"
        rx="3.25"
      />
      <path
        fill="#fff"
        d="M15.4792 28.1054h-2.4471v7.466h-2.0648v-7.466H8.52014v-1.6768h6.95906z"
      />
      <defs>
        <radialGradient
          id="pl-t-a"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(13.4784 0 0 33.2694 39.7967 22.1739)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a98aff" />
          <stop offset=".14" stopColor="#8c75ff" />
          <stop offset=".565" stopColor="#5f50e2" />
          <stop offset=".9" stopColor="#3c2cb8" />
        </radialGradient>
        <radialGradient
          id="pl-t-b"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(68.1539 -7.71566095 14.71355834)scale(32.752 33.1231)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#85c2ff" />
          <stop offset=".69" stopColor="#7588ff" />
          <stop offset="1" stopColor="#6459fe" />
        </radialGradient>
        <radialGradient
          id="pl-t-d"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(113.326 8.09285255 17.64474501)scale(19.2186 15.4273)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#bd96ff" />
          <stop offset=".686685" stopColor="#bd96ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="pl-t-e"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 -10 12.6216 0 32.9999 11.5714)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".268201" stopColor="#6868f7" />
          <stop offset="1" stopColor="#3923b1" />
        </radialGradient>
        <radialGradient
          id="pl-t-f"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(40.0516 -.03068196 44.8729095)scale(7.14629 10.3363)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".270711" stopColor="#a1d3ff" />
          <stop offset=".813393" stopColor="#a1d3ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="pl-t-g"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(-41.6581 32.11799918 -43.41948423)scale(8.51275 20.8824)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e3acfd" />
          <stop offset=".816041" stopColor="#9fa2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="pl-t-h"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 -12 15.146 0 17.9999 8.28571)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".268201" stopColor="#8282ff" />
          <stop offset="1" stopColor="#3923b1" />
        </radialGradient>
        <radialGradient
          id="pl-t-i"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(40.0516 -3.15465147 21.41641466)scale(8.57554 12.4035)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".270711" stopColor="#a1d3ff" />
          <stop offset=".813393" stopColor="#a1d3ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="pl-t-j"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(-41.6581 20.38180375 -26.51566158)scale(10.2153 25.0589)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e3acfd" />
          <stop offset=".816041" stopColor="#9fa2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="pl-t-k"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(45 -25.76345597 16.32842712)scale(22.6274)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".046875" stopColor="#688eff" />
          <stop offset=".946875" stopColor="#230f94" />
        </radialGradient>
        <radialGradient
          id="pl-t-l"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 11.2 -13.0702 0 12 32.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".570647" stopColor="#6965f6" stopOpacity="0" />
          <stop offset="1" stopColor="#8f8fff" />
        </radialGradient>
        <linearGradient
          id="pl-t-c"
          x1="20.5936"
          x2="20.5936"
          y1="18"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".801159" stopColor="#6864f6" stopOpacity="0" />
          <stop offset="1" stopColor="#5149de" />
        </linearGradient>
      </defs>
    </svg>
  )
}
