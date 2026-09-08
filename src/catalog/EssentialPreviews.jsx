import React from 'react';

export const essentialIds = new Set([
  'tooltip',
  'popover',
  'slider',
  'calendar',
  'date-picker',
  'table',
  'pagination',
  'sheet',
  'file-upload',
  'skeleton',
  'alert',
]);

/** Quiet, dependency-free thumbnails reflecting the actual Duoop component surfaces. */
export function EssentialPreview({ id }) {
  const rect = (x, y, w, h, fill = '#fff', radius = 8) => (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={radius}
      fill={fill}
      stroke="#373434"
      strokeWidth="2"
    />
  );
  const line = (x, y, w) => (
    <path
      d={`M${x} ${y}h${w}`}
      stroke="#aaa5a5"
      strokeWidth="5"
      strokeLinecap="round"
    />
  );
  let content;
  if (id === 'tooltip')
    content = (
      <>
        {rect(86, 93, 88, 35, '#1d1b1b')}
        {rect(86, 89, 88, 35)}
        <text x="130" y="112" textAnchor="middle">
          Save item
        </text>
        {rect(55, 28, 150, 40, '#373434')}
        <text x="130" y="53" textAnchor="middle" fill="#fff">
          Keep it for later
        </text>
        <path d="m123 68 7 7 7-7" fill="#373434" />
      </>
    );
  else if (id === 'popover')
    content = (
      <>
        {rect(36, 25, 98, 32, '#f0eeee')}
        <text x="85" y="46" textAnchor="middle">
          Edit details
        </text>
        {rect(36, 68, 185, 78, '#1d1b1b')}
        {rect(36, 64, 185, 78)}
        <text x="52" y="89" fontWeight="600">
          Collection details
        </text>
        {rect(52, 102, 150, 26, '#faf9f9', 5)}
        <text x="62" y="120" fontSize="10">
          Studio notes
        </text>
      </>
    );
  else if (id === 'slider')
    content = (
      <>
        <text x="28" y="42" fontWeight="600">
          Price per night
        </text>
        <text x="232" y="42" textAnchor="end" fill="#686565">
          €80 – €280
        </text>
        {rect(28, 78, 204, 8, '#f0eeee', 4)}
        <path d="M65 82h114" stroke="#373434" strokeWidth="7" />
        {[65, 179].map((x) => (
          <g key={x}>
            {rect(x - 10, 69, 20, 28, '#1d1b1b', 6)}
            {rect(x - 10, 65, 20, 28, '#fff', 6)}
            <path d={`M${x - 2} 74v10m4-10v10`} stroke="#777474" />
          </g>
        ))}
        <text x="28" y="121" fill="#686565">
          €0
        </text>
        <text x="232" y="121" textAnchor="end" fill="#686565">
          €500
        </text>
      </>
    );
  else if (id === 'calendar')
    content = (
      <>
        {rect(50, 12, 160, 141, '#1d1b1b')}
        {rect(50, 8, 160, 141)}
        <text x="64" y="31" fontWeight="600">
          September 2026
        </text>
        <text x="75" y="51" fontSize="8" letterSpacing="5">
          M T W T F S S
        </text>
        {Array.from({ length: 28 }, (_, i) => {
          const x = 68 + (i % 7) * 20,
            y = 70 + Math.floor(i / 7) * 20;
          return (
            <g key={i}>
              {i === 15 && rect(x - 8, y - 12, 18, 19, '#373434', 4)}
              <text
                x={x + 1}
                y={y + 1}
                textAnchor="middle"
                fill={i === 15 ? '#fff' : '#686565'}
                fontSize="9"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </>
    );
  else if (id === 'date-picker')
    content = (
      <>
        <text x="28" y="52" fontWeight="600">
          Your next visit
        </text>
        {rect(28, 72, 204, 46, '#1d1b1b')}
        {rect(28, 68, 204, 46)}
        <text x="44" y="96">
          16 Sep 2026
        </text>
        <path
          d="M199 80h17v19h-17zM203 77v6m9-6v6m-13 4h17"
          stroke="#373434"
          fill="none"
          strokeWidth="1.5"
        />
      </>
    );
  else if (id === 'table')
    content = (
      <>
        {rect(15, 20, 230, 123, '#1d1b1b')}
        {rect(15, 16, 230, 123)}
        <path d="M16 49h228M16 79h228M16 109h228" stroke="#d0cccc" />
        <text x="30" y="38" fontWeight="600">
          Project
        </text>
        <text x="173" y="38" fontWeight="600">
          Budget
        </text>
        {['Studio website', 'Brand guidelines', 'Autumn campaign'].map((s, i) => (
          <g key={s}>
            <text x="30" y={69 + i * 30} fontSize="10">
              {s}
            </text>
            <text x="174" y={69 + i * 30} fontSize="10">
              {['€4,200', '€1,800', '€6,500'][i]}
            </text>
          </g>
        ))}
      </>
    );
  else if (id === 'pagination')
    content = (
      <>
        <text x="130" y="48" textAnchor="middle" fill="#686565">
          A few pages worth keeping.
        </text>
        {['‹', '1', '2', '3', '›'].map((s, i) => (
          <g key={s}>
            {rect(20 + i * 46, 77, 36, 36, '#1d1b1b')}
            {rect(20 + i * 46, 73, 36, 36, i === 2 ? '#373434' : '#fff')}
            <text
              x={38 + i * 46}
              y="96"
              textAnchor="middle"
              fill={i === 2 ? '#fff' : '#373434'}
            >
              {s}
            </text>
          </g>
        ))}
      </>
    );
  else if (id === 'sheet')
    content = (
      <>
        {rect(22, 13, 216, 136, '#efeded')}
        {line(40, 37, 45)}
        {line(40, 59, 70)}
        {line(40, 81, 52)}
        {rect(125, 13, 113, 136)}
        <text x="138" y="38" fontWeight="600">
          Refine your stay
        </text>
        {line(141, 59, 65)}
        {line(141, 77, 44)}
        {rect(141, 106, 80, 26, '#373434', 6)}
        <text x="181" y="123" textAnchor="middle" fontSize="10" fill="#fff">
          Apply filters
        </text>
      </>
    );
  else if (id === 'file-upload')
    content = (
      <>
        <rect
          x="28"
          y="14"
          width="204"
          height="135"
          rx="10"
          fill="#fff"
          stroke="#777474"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        {rect(114, 33, 32, 39, '#1d1b1b', 5)}
        {rect(114, 29, 32, 39, '#f7f6f6', 5)}
        <path d="M122 43h16m-16 7h16m-16 7h9" stroke="#777474" strokeWidth="1.5" />
        <text x="130" y="93" textAnchor="middle" fontWeight="600">
          A place for your files
        </text>
        <text x="130" y="116" textAnchor="middle" fontSize="10" fill="#686565">
          Drop here or browse your device
        </text>
      </>
    );
  else if (id === 'skeleton')
    content = (
      <>
        {rect(28, 15, 204, 131)}
        <rect
          x="44"
          y="31"
          width="40"
          height="40"
          rx="10"
          fill="#eae7e7"
          stroke="#d0cccc"
        />
        {line(100, 42, 90)}
        {line(100, 60, 58)}
        {line(44, 94, 166)}
        {line(44, 112, 166)}
        {line(44, 130, 107)}
      </>
    );
  else
    content = (
      <>
        {rect(18, 40, 224, 84, '#234631')}
        {rect(18, 36, 224, 84, '#edf5ef')}
        <path d="m34 64 5 5 10-12" stroke="#356247" strokeWidth="2" fill="none" />
        <text x="61" y="64" fontWeight="600" fill="#356247">
          Your workspace is ready.
        </text>
        <text x="61" y="86" fontSize="10" fill="#356247">
          Invite your team whenever
        </text>
        <text x="61" y="101" fontSize="10" fill="#356247">
          you are ready.
        </text>
      </>
    );
  return (
    <svg
      viewBox="0 0 260 165"
      width="280"
      style={{ maxWidth: '90%', height: 'auto' }}
      fill="#373434"
      fontFamily="DM Sans, sans-serif"
      fontSize="12"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
