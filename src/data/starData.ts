export interface StarData {
  systemId: number;
  systemName: string;
  connectedTo: {
    systemId: number;
    systemName: string;
    jumpGateRaceId: number;
  }[];
  connectionCount: number;
}

export const starData: StarData[] = [
  {
    systemId: 14131,
    systemName: 'Sol',
    connectedTo: [
      {
        systemId: 14295,
        systemName: 'Proxima Centauri',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14298,
        systemName: 'Alpha Centauri',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14296,
        systemName: 'Barnards Star',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14362,
    systemName: '103 Leonis',
    connectedTo: [
      {
        systemId: 14355,
        systemName: '116 Aquarii',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14346,
    systemName: '114 Herculis',
    connectedTo: [
      {
        systemId: 14341,
        systemName: 'GJ 3323',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14360,
        systemName: '82 Orionis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14367,
        systemName: '70 Eridani',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14357,
        systemName: '82 Eridani',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 4,
  },
  {
    systemId: 14355,
    systemName: '116 Aquarii',
    connectedTo: [
      {
        systemId: 14340,
        systemName: '85 Cancri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14362,
        systemName: '103 Leonis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14338,
    systemName: '116 Herculis',
    connectedTo: [
      {
        systemId: 14326,
        systemName: 'V577 Monoceri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14341,
        systemName: 'GJ 3323',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14345,
    systemName: '142 Tauri',
    connectedTo: [
      {
        systemId: 14343,
        systemName: '75 Ophiuchi',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14358,
        systemName: 'Pi Librae',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14347,
    systemName: '25 Ursae Minoris',
    connectedTo: [
      {
        systemId: 14316,
        systemName: 'Epsilon Indi',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14325,
    systemName: '40 Eridani',
    connectedTo: [
      {
        systemId: 14306,
        systemName: 'Pi Ophiuchi',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14343,
        systemName: '75 Ophiuchi',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14342,
        systemName: 'HO Librae',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14356,
    systemName: '52 Capricorni',
    connectedTo: [
      {
        systemId: 14340,
        systemName: '85 Cancri',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14305,
    systemName: '61 Cygni',
    connectedTo: [
      {
        systemId: 14298,
        systemName: 'Alpha Centauri',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14308,
        systemName: 'Beta Antliae',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14367,
    systemName: '70 Eridani',
    connectedTo: [
      {
        systemId: 14346,
        systemName: '114 Herculis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14343,
    systemName: '75 Ophiuchi',
    connectedTo: [
      {
        systemId: 14345,
        systemName: '142 Tauri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14325,
        systemName: '40 Eridani',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14327,
    systemName: '76 Ophiuchi',
    connectedTo: [
      {
        systemId: 14313,
        systemName: '86 Geminorum',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14348,
        systemName: 'Pi-3 Orionis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14357,
    systemName: '82 Eridani',
    connectedTo: [
      {
        systemId: 14346,
        systemName: '114 Herculis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14360,
    systemName: '82 Orionis',
    connectedTo: [
      {
        systemId: 14346,
        systemName: '114 Herculis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14372,
    systemName: '84 Cancri',
    connectedTo: [
      {
        systemId: 14317,
        systemName: 'Chi Gruis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14340,
    systemName: '85 Cancri',
    connectedTo: [
      {
        systemId: 14356,
        systemName: '52 Capricorni',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14355,
        systemName: '116 Aquarii',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14333,
        systemName: 'Gamma Telescopii',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14317,
        systemName: 'Chi Gruis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 4,
  },
  {
    systemId: 14313,
    systemName: '86 Geminorum',
    connectedTo: [
      {
        systemId: 14333,
        systemName: 'Gamma Telescopii',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14327,
        systemName: '76 Ophiuchi',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14310,
        systemName: 'Herschel 5173',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14332,
    systemName: '88 Ursae Majoris',
    connectedTo: [
      {
        systemId: 14324,
        systemName: 'P Eridani',
        jumpGateRaceId: 624,
      },
      {
        systemId: 14353,
        systemName: 'Sigma Eridani',
        jumpGateRaceId: 624,
      },
      {
        systemId: 14349,
        systemName: 'Mu Reticuli',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14312,
    systemName: 'AD Leonis',
    connectedTo: [
      {
        systemId: 14315,
        systemName: 'Nu Sculptoris',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14317,
        systemName: 'Chi Gruis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14310,
        systemName: 'Herschel 5173',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14316,
        systemName: 'Epsilon Indi',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 4,
  },
  {
    systemId: 14314,
    systemName: 'AX Microscopii',
    connectedTo: [
      {
        systemId: 14309,
        systemName: 'Luhman 16',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14318,
        systemName: 'HIP 33226',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14298,
    systemName: 'Alpha Centauri',
    connectedTo: [
      {
        systemId: 14305,
        systemName: '61 Cygni',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14131,
        systemName: 'Sol',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14296,
    systemName: 'Barnards Star',
    connectedTo: [
      {
        systemId: 14131,
        systemName: 'Sol',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14308,
    systemName: 'Beta Antliae',
    connectedTo: [
      {
        systemId: 14305,
        systemName: '61 Cygni',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14317,
    systemName: 'Chi Gruis',
    connectedTo: [
      {
        systemId: 14372,
        systemName: '84 Cancri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14312,
        systemName: 'AD Leonis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14340,
        systemName: '85 Cancri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14363,
        systemName: 'GJ 3522',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 4,
  },
  {
    systemId: 14304,
    systemName: 'DX Cancri',
    connectedTo: [
      {
        systemId: 14295,
        systemName: 'Proxima Centauri',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14310,
        systemName: 'Herschel 5173',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14323,
    systemName: 'Delta Carinae',
    connectedTo: [
      {
        systemId: 14311,
        systemName: 'EV Lacertae',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14311,
    systemName: 'EV Lacertae',
    connectedTo: [
      {
        systemId: 14322,
        systemName: 'HIP 54298',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14323,
        systemName: 'Delta Carinae',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14307,
        systemName: 'Wolf 359',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14316,
    systemName: 'Epsilon Indi',
    connectedTo: [
      {
        systemId: 14312,
        systemName: 'AD Leonis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14347,
        systemName: '25 Ursae Minoris',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14341,
    systemName: 'GJ 3323',
    connectedTo: [
      {
        systemId: 14338,
        systemName: '116 Herculis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14344,
        systemName: 'Psi Herculis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14346,
        systemName: '114 Herculis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14363,
    systemName: 'GJ 3522',
    connectedTo: [
      {
        systemId: 14317,
        systemName: 'Chi Gruis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14333,
    systemName: 'Gamma Telescopii',
    connectedTo: [
      {
        systemId: 14313,
        systemName: '86 Geminorum',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14340,
        systemName: '85 Cancri',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14303,
    systemName: 'HH Andromedae',
    connectedTo: [
      {
        systemId: 14295,
        systemName: 'Proxima Centauri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14309,
        systemName: 'Luhman 16',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14318,
    systemName: 'HIP 33226',
    connectedTo: [
      {
        systemId: 14314,
        systemName: 'AX Microscopii',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14322,
    systemName: 'HIP 54298',
    connectedTo: [
      {
        systemId: 14311,
        systemName: 'EV Lacertae',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14350,
    systemName: 'HIP 84581',
    connectedTo: [
      {
        systemId: 14348,
        systemName: 'Pi-3 Orionis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14342,
    systemName: 'HO Librae',
    connectedTo: [
      {
        systemId: 14325,
        systemName: '40 Eridani',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14310,
    systemName: 'Herschel 5173',
    connectedTo: [
      {
        systemId: 14304,
        systemName: 'DX Cancri',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14312,
        systemName: 'AD Leonis',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14313,
        systemName: '86 Geminorum',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14309,
    systemName: 'Luhman 16',
    connectedTo: [
      {
        systemId: 14314,
        systemName: 'AX Microscopii',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14303,
        systemName: 'HH Andromedae',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14349,
    systemName: 'Mu Reticuli',
    connectedTo: [
      {
        systemId: 14332,
        systemName: '88 Ursae Majoris',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14344,
        systemName: 'Psi Herculis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14315,
    systemName: 'Nu Sculptoris',
    connectedTo: [
      {
        systemId: 14371,
        systemName: 'Vyssotsky McCormick 541',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14370,
        systemName: 'Ross 128',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14312,
        systemName: 'AD Leonis',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14324,
    systemName: 'P Eridani',
    connectedTo: [
      {
        systemId: 14332,
        systemName: '88 Ursae Majoris',
        jumpGateRaceId: 624,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14358,
    systemName: 'Pi Librae',
    connectedTo: [
      {
        systemId: 14345,
        systemName: '142 Tauri',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14366,
        systemName: 'Teegardens Star',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14306,
    systemName: 'Pi Ophiuchi',
    connectedTo: [
      {
        systemId: 14302,
        systemName: 'Psi Ceti',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14325,
        systemName: '40 Eridani',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14326,
        systemName: 'V577 Monoceri',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14348,
    systemName: 'Pi-3 Orionis',
    connectedTo: [
      {
        systemId: 14327,
        systemName: '76 Ophiuchi',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14350,
        systemName: 'HIP 84581',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14295,
    systemName: 'Proxima Centauri',
    connectedTo: [
      {
        systemId: 14302,
        systemName: 'Psi Ceti',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14303,
        systemName: 'HH Andromedae',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14131,
        systemName: 'Sol',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14304,
        systemName: 'DX Cancri',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 4,
  },
  {
    systemId: 14302,
    systemName: 'Psi Ceti',
    connectedTo: [
      {
        systemId: 14307,
        systemName: 'Wolf 359',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14306,
        systemName: 'Pi Ophiuchi',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14295,
        systemName: 'Proxima Centauri',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14344,
    systemName: 'Psi Herculis',
    connectedTo: [
      {
        systemId: 14349,
        systemName: 'Mu Reticuli',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14341,
        systemName: 'GJ 3323',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14370,
    systemName: 'Ross 128',
    connectedTo: [
      {
        systemId: 14315,
        systemName: 'Nu Sculptoris',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14353,
    systemName: 'Sigma Eridani',
    connectedTo: [
      {
        systemId: 14332,
        systemName: '88 Ursae Majoris',
        jumpGateRaceId: 624,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14366,
    systemName: 'Teegardens Star',
    connectedTo: [
      {
        systemId: 14358,
        systemName: 'Pi Librae',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14326,
    systemName: 'V577 Monoceri',
    connectedTo: [
      {
        systemId: 14338,
        systemName: '116 Herculis',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14306,
        systemName: 'Pi Ophiuchi',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 2,
  },
  {
    systemId: 14371,
    systemName: 'Vyssotsky McCormick 541',
    connectedTo: [
      {
        systemId: 14315,
        systemName: 'Nu Sculptoris',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
  {
    systemId: 14307,
    systemName: 'Wolf 359',
    connectedTo: [
      {
        systemId: 14302,
        systemName: 'Psi Ceti',
        jumpGateRaceId: 623,
      },
      {
        systemId: 14319,
        systemName: 'YZ Ceti',
        jumpGateRaceId: 0,
      },
      {
        systemId: 14311,
        systemName: 'EV Lacertae',
        jumpGateRaceId: 623,
      },
    ],
    connectionCount: 3,
  },
  {
    systemId: 14319,
    systemName: 'YZ Ceti',
    connectedTo: [
      {
        systemId: 14307,
        systemName: 'Wolf 359',
        jumpGateRaceId: 0,
      },
    ],
    connectionCount: 1,
  },
];
