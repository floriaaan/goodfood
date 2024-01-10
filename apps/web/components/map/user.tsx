import { memo } from "react";

const Pin = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: "block",
    }}
  >
    <g filter="url(#filter0_d_324_333)">
      <rect x={16} y={12} width={16} height={16} rx={8} fill="#276EF1" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26 20C26 18.8954 25.1046 18 24 18C22.8954 18 22 18.8954 22 20C22 21.1046 22.8954 22 24 22C25.1046 22 26 21.1046 26 20Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_324_333"
        x={0}
        y={0}
        width={48}
        height={48}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={8} />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_324_333" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_324_333" result="shape" />
      </filter>
    </defs>
  </svg>
);

export const UserPin = memo(Pin);
