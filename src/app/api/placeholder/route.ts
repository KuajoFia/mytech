import { NextResponse } from "next/server";

export const GET = async () => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
    <rect width='400' height='400' fill='#F5F7FA'/>
    <rect x='20' y='20' width='360' height='360' fill='none' stroke='#E2E8F0' stroke-dasharray='6 6' rx='8'/>
    <text x='200' y='190' font-family='Arial' font-size='16' fill='#5C6678' text-anchor='middle'>AGBE-TECH</text>
    <text x='200' y='215' font-family='Arial' font-size='12' fill='#94A3B8' text-anchor='middle'>Image du produit</text>
  </svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
