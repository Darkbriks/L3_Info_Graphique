const celestialBodiesData = [
    [
        { name: 'Sun', radius: 696342, parent: null },
        { axialTilt: DEG_TO_RAD(7.25), selfRotationPeriod: DAY_TO_SEC(27.28) },
        { diffuseTextureUrl: 'Images/sun2k.jpg', basicMaterial: true }, { lock: true }
    ],
    [
        { name: 'Mercury', radius: 2439.7, parent: 'Sun' },
        {
            semiMajorAxis: 57909227,
            eccentricity: 0.20563069,
            inclination: DEG_TO_RAD(7.00487),
            argumentOfPeriapsis: DEG_TO_RAD(29.124),
            longitudeOfAscendingNode: DEG_TO_RAD(48.331),
            orbitalPeriod: DAY_TO_SEC(87.9691),
            selfRotationPeriod: DAY_TO_SEC(58.646)
        },
        { diffuseTextureUrl: 'Images/Mercury/mercurymap.jpg', bumpTextureUrl: 'Images/Mercury/mercurybump.jpg', bumpScale: 0.01 },
        { helper: true, helperColor: 0xaaaaaa }
    ],
    [
        { name: 'Venus', radius: 6051.8, parent: 'Sun' },
        {
            semiMajorAxis: 108209475,
            eccentricity: 0.00677188,
            inclination: DEG_TO_RAD(3.39471),
            argumentOfPeriapsis: DEG_TO_RAD(54.884),
            longitudeOfAscendingNode: DEG_TO_RAD(76.680),
            orbitalPeriod: DAY_TO_SEC(224.701),
            selfRotationPeriod: DAY_TO_SEC(-243.025)
        },
        { diffuseTextureUrl: 'Images/Venus/venusmap.jpg', bumpTextureUrl: 'Images/Venus/venusbump.jpg', bumpScale: 0.05 },
        { helper: true, helperColor: 0xffdd44 }
    ],
    [
        { name: 'Earth', radius: 6378.137, parent: 'Sun' },
        {
            semiMajorAxis: 149597887.5,
            eccentricity: 0.01671022,
            inclination: 0,
            argumentOfPeriapsis: DEG_TO_RAD(288.064),
            longitudeOfAscendingNode: DEG_TO_RAD(174.873),
            orbitalPeriod: DAY_TO_SEC(365.256363),
            axialTilt: DEG_TO_RAD(23.4366907752),
            selfRotationPeriod: DAY_TO_SEC(0.99726949)
        },
        {
            diffuseTextureUrl: 'Images/Earth/earthmap4k.jpg',
            bumpTextureUrl: 'Images/Earth/earthbump4k.jpg',
            specularTextureUrl: 'Images/Earth/earthspec4k.jpg',
            specularColor: new THREE.Color('grey')
        },
        { helper: true, helperColor: 0x3399ff }
    ],
    [
        { name: 'EarthClouds', radius: 6428.137, parent: 'Sun' },
        {
            semiMajorAxis: 149597887.5,
            eccentricity: 0.01671022,
            inclination: 0,
            argumentOfPeriapsis: DEG_TO_RAD(288.064),
            longitudeOfAscendingNode: DEG_TO_RAD(174.873),
            orbitalPeriod: DAY_TO_SEC(365.256363),
            axialTilt: DEG_TO_RAD(23.4366907752),
            selfRotationPeriod: DAY_TO_SEC(0.5)
        },
        {
            diffuseTextureUrl: 'Images/Earth/earthcloudmap.jpg',
            alphaTextureUrl: 'Images/Earth/earthcloudmap.jpg',
            opacity: 0.8,
            transparent: true
        },
        { helper: true, helperColor: 0x888888, createFocusButton: false }
    ],
    [
        { name: 'Moon', radius: 1737.1, parent: 'Earth' },
        {
            semiMajorAxis: 384400,
            eccentricity: 0.0549,
            inclination: DEG_TO_RAD(5.145),
            argumentOfPeriapsis: DEG_TO_RAD(125.08),
            longitudeOfAscendingNode: DEG_TO_RAD(318.15),
            orbitalPeriod: DAY_TO_SEC(27.321582),
            axialTilt: DEG_TO_RAD(1.5424),
            selfRotationPeriod: DAY_TO_SEC(27.321582)
        },
        { diffuseTextureUrl: 'Images/Moon/lroc_color_poles_1k.jpg', bumpTextureUrl: 'Images/Moon/ldem_3_8bit.jpg' },
        { helper: true, helperColor: 0x888888 }
    ],
    [
        { name: 'Mars', radius: 3396.2, parent: 'Sun' },
        {
            semiMajorAxis: 227939100,
            eccentricity: 0.09341233,
            inclination: DEG_TO_RAD(1.85061),
            argumentOfPeriapsis: DEG_TO_RAD(286.502),
            longitudeOfAscendingNode: DEG_TO_RAD(49.558),
            orbitalPeriod: DAY_TO_SEC(686.971),
            axialTilt: DEG_TO_RAD(25.19),
            selfRotationPeriod: DAY_TO_SEC(1.02595676)
        },
        {
            diffuseTextureUrl: 'Images/Mars/mars_1k_color.jpg',
            normalTextureUrl: 'Images/Mars/mars_1k_normal.jpg',
            bumpTextureUrl: 'Images/Mars/marsbump1k.jpg',
        },
        { helper: true, helperColor: 0xff5500 }
    ],
    [
        { name: 'Deimos', radius: 6.2, parent: 'Mars' },
        {
            semiMajorAxis: 23459.4,
            eccentricity: 0.00033,
            inclination: DEG_TO_RAD(1.788),
            argumentOfPeriapsis: DEG_TO_RAD(24.525),
            longitudeOfAscendingNode: DEG_TO_RAD(151.46),
            orbitalPeriod: DAY_TO_SEC(1.26244),
            axialTilt: DEG_TO_RAD(0.93),
            selfRotationPeriod: DAY_TO_SEC(1.26244)
        },
        { diffuseTextureUrl: 'Images/Deimos/deimos.webp', bumpTextureUrl: 'Images/Deimos/deimosbump.jpg', bumpScale: 0.005 },
        { helper: true, helperColor: 0xaa2200 }
    ],
    [
        { name: 'Phobos', radius: 11.1, parent: 'Mars' },
        {
            semiMajorAxis: 9376.2,
            eccentricity: 0.0151,
            inclination: DEG_TO_RAD(1.093),
            argumentOfPeriapsis: DEG_TO_RAD(150.057),
            longitudeOfAscendingNode: DEG_TO_RAD(207.82),
            orbitalPeriod: DAY_TO_SEC(0.31891),
            axialTilt: DEG_TO_RAD(1.093),
            selfRotationPeriod: DAY_TO_SEC(0.31891)
        },
        { diffuseTextureUrl: 'Images/Phobos/phobos.jpg', bumpTextureUrl: 'Images/Phobos/phobosbump.jpg', bumpScale: 0.01 },
        { helper: true, helperColor: 0xaa2200 }
    ],
    [
        { name: 'Ceres', radius: 469.73, parent: 'Sun' },
        {
            semiMajorAxis: 413767000,
            eccentricity: 0.079903,
            inclination: DEG_TO_RAD(10.587),
            argumentOfPeriapsis: DEG_TO_RAD(72.556),
            longitudeOfAscendingNode: DEG_TO_RAD(80.305),
            orbitalPeriod: DAY_TO_SEC(1683.14570801),
            axialTilt: DEG_TO_RAD(4.0),
            selfRotationPeriod: DAY_TO_SEC(0.3781)
        },
        { diffuseTextureUrl: 'Images/Ceres/Ceres.webp', bumpTextureUrl: 'Images/Ceres/Ceres_bump.webp', bumpScale: 0.025 },
        { helper: true, helperColor: 0x996633 }
    ],
    [
        { name: 'Jupiter', radius: 71492, parent: 'Sun' },
        {
            semiMajorAxis: 778547200,
            eccentricity: 0.04839266,
            inclination: DEG_TO_RAD(1.30530),
            argumentOfPeriapsis: DEG_TO_RAD(273.867),
            longitudeOfAscendingNode: DEG_TO_RAD(100.464),
            orbitalPeriod: DAY_TO_SEC(4332.59),
            axialTilt: DEG_TO_RAD(3.13),
            selfRotationPeriod: DAY_TO_SEC(0.41354)
        },
        { diffuseTextureUrl: 'Images/Jupiter/jupiter2_4k.jpg' },
        { helper: true, helperColor: 0xff8800 }
    ],
    [
        { name: 'Io', radius: 1821.6, parent: 'Jupiter' },
        {
            semiMajorAxis: 421700,
            eccentricity: 0.0041,
            inclination: DEG_TO_RAD(0.05),
            argumentOfPeriapsis: DEG_TO_RAD(84.129),
            longitudeOfAscendingNode: DEG_TO_RAD(43.977),
            orbitalPeriod: DAY_TO_SEC(1.769),
            axialTilt: DEG_TO_RAD(0.05),
            selfRotationPeriod: DAY_TO_SEC(1.769)
        },
        { diffuseTextureUrl: 'Images/Jupiter/Moons/io.webp' },
        { helper: true, helperColor: 0xffcc33 }
    ],
    [
        { name: 'Europa', radius: 1560.8, parent: 'Jupiter' },
        {
            semiMajorAxis: 671034,
            eccentricity: 0.0094,
            inclination: DEG_TO_RAD(0.471),
            argumentOfPeriapsis: DEG_TO_RAD(219.106),
            longitudeOfAscendingNode: DEG_TO_RAD(219.106),
            orbitalPeriod: DAY_TO_SEC(3.551),
            axialTilt: DEG_TO_RAD(0.471),
            selfRotationPeriod: DAY_TO_SEC(3.551)
        },
        { diffuseTextureUrl: 'Images/Jupiter/Moons/europa.webp' },
        { helper: true, helperColor: 0x99ccff }
    ],
    [
        { name: 'Ganymede', radius: 2634.1, parent: 'Jupiter' },
        {
            semiMajorAxis: 1070412,
            eccentricity: 0.0013,
            inclination: DEG_TO_RAD(0.195),
            argumentOfPeriapsis: DEG_TO_RAD(63.552),
            longitudeOfAscendingNode: DEG_TO_RAD(63.552),
            orbitalPeriod: DAY_TO_SEC(7.154),
            axialTilt: DEG_TO_RAD(0.195),
            selfRotationPeriod: DAY_TO_SEC(7.154)
        },
        { diffuseTextureUrl: 'Images/Jupiter/Moons/ganymede.webp' },
        { helper: true, helperColor: 0xbbbbbb }
    ],
    [
        { name: 'Callisto', radius: 2410.3, parent: 'Jupiter' },
        {
            semiMajorAxis: 1882709,
            eccentricity: 0.0074,
            inclination: DEG_TO_RAD(0.192),
            argumentOfPeriapsis: DEG_TO_RAD(298.848),
            longitudeOfAscendingNode: DEG_TO_RAD(298.848),
            orbitalPeriod: DAY_TO_SEC(16.689),
            axialTilt: DEG_TO_RAD(0.192),
            selfRotationPeriod: DAY_TO_SEC(16.689)
        },
        { diffuseTextureUrl: 'Images/Jupiter/Moons/callisto.webp' },
        { helper: true, helperColor: 0x888888 }
    ],
    [
        { name: 'Saturn', /*equatorialRadius: 60268, polarRadius: 54364*/ radius: 60268, parent: 'Sun' },
        {
            semiMajorAxis: 1433449370,
            eccentricity: 0.055723219,
            inclination: DEG_TO_RAD(2.48446),
            argumentOfPeriapsis: DEG_TO_RAD(339.392),
            longitudeOfAscendingNode: DEG_TO_RAD(113.665),
            orbitalPeriod: DAY_TO_SEC(10759.22),
            axialTilt: DEG_TO_RAD(26.7390),
            selfRotationPeriod: DAY_TO_SEC(0.444)
        },
        { diffuseTextureUrl: 'Images/Saturn/saturnmap.jpg' },
        { helper: true, helperColor: 0xffcc00 }
    ],
    [
        { name: 'Titan', radius: 2574.7, parent: 'Saturn' },
        {
            semiMajorAxis: 1221870,
            eccentricity: 0.0288,
            inclination: DEG_TO_RAD(0.34854),
            argumentOfPeriapsis: DEG_TO_RAD(28.060),
            longitudeOfAscendingNode: DEG_TO_RAD(168.803),
            orbitalPeriod: DAY_TO_SEC(15.945),
            axialTilt: DEG_TO_RAD(0.34854),
            selfRotationPeriod: DAY_TO_SEC(15.945)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/titan.webp' },
        { helper: true, helperColor: 0xffbb66 }
    ],
    [
        { name: 'Rhea', radius: 763.8, parent: 'Saturn' },
        {
            semiMajorAxis: 527108,
            eccentricity: 0.001258,
            inclination: DEG_TO_RAD(0.345),
            argumentOfPeriapsis: DEG_TO_RAD(113.949),
            longitudeOfAscendingNode: DEG_TO_RAD(345.944),
            orbitalPeriod: DAY_TO_SEC(4.518),
            axialTilt: DEG_TO_RAD(0.345),
            selfRotationPeriod: DAY_TO_SEC(4.518)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/rhea.webp' },
        { helper: true, helperColor: 0xdddddd }
    ],
    [
        { name: 'Iapetus', radius: 734.5, parent: 'Saturn' },
        {
            semiMajorAxis: 3560840,
            eccentricity: 0.028613,
            inclination: DEG_TO_RAD(15.47),
            argumentOfPeriapsis: DEG_TO_RAD(75.62),
            longitudeOfAscendingNode: DEG_TO_RAD(143.62),
            orbitalPeriod: DAY_TO_SEC(79.3215),
            axialTilt: DEG_TO_RAD(15.47),
            selfRotationPeriod: DAY_TO_SEC(79.3215)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/iapetus.webp' },
        { helper: true, helperColor: 0xaaaaaa }
    ],
    [
        { name: 'Dioné', radius: 561.4, parent: 'Saturn' },
        {
            semiMajorAxis: 377396,
            eccentricity: 0.0022,
            inclination: DEG_TO_RAD(0.019),
            argumentOfPeriapsis: DEG_TO_RAD(284.96),
            longitudeOfAscendingNode: DEG_TO_RAD(169.57),
            orbitalPeriod: DAY_TO_SEC(2.7369),
            axialTilt: DEG_TO_RAD(0.019),
            selfRotationPeriod: DAY_TO_SEC(2.7369)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/dione.webp' },
        { helper: true, helperColor: 0xbbbbbb }
    ],
    [
        { name: 'Téthys', radius: 531.1, parent: 'Saturn' },
        {
            semiMajorAxis: 294619,
            eccentricity: 0.0001,
            inclination: DEG_TO_RAD(1.12),
            argumentOfPeriapsis: DEG_TO_RAD(257.47),
            longitudeOfAscendingNode: DEG_TO_RAD(328.08),
            orbitalPeriod: DAY_TO_SEC(1.8878),
            axialTilt: DEG_TO_RAD(1.12),
            selfRotationPeriod: DAY_TO_SEC(1.8878)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/tethys.webp' },
        { helper: true, helperColor: 0xbbbbbb }
    ],
    [
        { name: 'Encelade', radius: 252.1, parent: 'Saturn' },
        {
            semiMajorAxis: 238042,
            eccentricity: 0.0047,
            inclination: DEG_TO_RAD(0.009),
            argumentOfPeriapsis: DEG_TO_RAD(342.51),
            longitudeOfAscendingNode: DEG_TO_RAD(168.69),
            orbitalPeriod: DAY_TO_SEC(1.3702),
            axialTilt: DEG_TO_RAD(0.009),
            selfRotationPeriod: DAY_TO_SEC(1.3702)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/enceladus.webp' },
        { helper: true, helperColor: 0xffffff }
    ],
    [
        { name: 'Mimas', radius: 198.2, parent: 'Saturn' },
        {
            semiMajorAxis: 185539,
            eccentricity: 0.0196,
            inclination: DEG_TO_RAD(1.574),
            argumentOfPeriapsis: DEG_TO_RAD(130.72),
            longitudeOfAscendingNode: DEG_TO_RAD(342.13),
            orbitalPeriod: DAY_TO_SEC(0.942),
            axialTilt: DEG_TO_RAD(1.574),
            selfRotationPeriod: DAY_TO_SEC(0.942)
        },
        { diffuseTextureUrl: 'Images/Saturn/Moons/mimas.webp' },
        { helper: true, helperColor: 0xcccccc }
    ],
    [
        { name: 'Uranus', radius: 25559, parent: 'Sun' },
        {
            semiMajorAxis: 2870658186,
            eccentricity: 0.046381,
            inclination: DEG_TO_RAD(0.772),
            argumentOfPeriapsis: DEG_TO_RAD(96.541),
            longitudeOfAscendingNode: DEG_TO_RAD(74.229),
            orbitalPeriod: DAY_TO_SEC(30685.4),
            axialTilt: DEG_TO_RAD(97.77),
            selfRotationPeriod: DAY_TO_SEC(-0.71833)
        },
        { diffuseTextureUrl: 'Images/Uranus/uranusmap.jpg' },
        { helper: true, helperColor: 0x66ccff }
    ],
    [
        { name: 'Neptune', radius: 24764, parent: 'Sun' },
        {
            semiMajorAxis: 4498396441,
            eccentricity: 0.011214269,
            inclination: DEG_TO_RAD(1.767975),
            argumentOfPeriapsis: DEG_TO_RAD(265.646853),
            longitudeOfAscendingNode: DEG_TO_RAD(131.794310),
            orbitalPeriod: DAY_TO_SEC(60189),
            axialTilt: DEG_TO_RAD(28.32),
            selfRotationPeriod: DAY_TO_SEC(0.67125)
        },
        { diffuseTextureUrl: 'Images/Neptune/neptunemap.jpg' },
        { helper: true, helperColor: 0x3366ff }
    ],
    [
        { name: 'Triton', radius: 1353.4, parent: 'Neptune' },
        {
            semiMajorAxis: 354759,
            eccentricity: 0.000016,
            inclination: DEG_TO_RAD(156.865),
            argumentOfPeriapsis: DEG_TO_RAD(66.129),
            longitudeOfAscendingNode: DEG_TO_RAD(176.630),
            orbitalPeriod: DAY_TO_SEC(-5.876854),
            axialTilt: DEG_TO_RAD(156.865),
            selfRotationPeriod: DAY_TO_SEC(-5.876854)
        },
        { diffuseTextureUrl: 'Images/triton.webp' },
        { helper: true, helperColor: 0x6699cc }
    ],
    [
        { name: 'Pluto', radius: 1188.3, parent: 'Sun' },
        {
            semiMajorAxis: 5906440628,
            eccentricity: 0.2488,
            inclination: DEG_TO_RAD(17.16),
            argumentOfPeriapsis: DEG_TO_RAD(113.763),
            longitudeOfAscendingNode: DEG_TO_RAD(110.299),
            orbitalPeriod: DAY_TO_SEC(90560),
            axialTilt: DEG_TO_RAD(119.61),
            selfRotationPeriod: DAY_TO_SEC(6.387230)
        },
        { diffuseTextureUrl: 'Images/Pluto/plutomap2k.jpg', bumpTextureUrl: 'Images/Pluto/plutobump2k.jpg' },
        { helper: true, helperColor: 0x996655 }
    ],
    [
        { name: 'Charon', radius: 606, parent: 'Pluto' },
        {
            semiMajorAxis: 19591,
            eccentricity: 0.0022,
            inclination: DEG_TO_RAD(0.001),
            argumentOfPeriapsis: DEG_TO_RAD(38.373),
            longitudeOfAscendingNode: DEG_TO_RAD(224.365),
            orbitalPeriod: DAY_TO_SEC(6.387230),
            axialTilt: DEG_TO_RAD(0.001),
            selfRotationPeriod: DAY_TO_SEC(6.387230)
        },
        { diffuseTextureUrl: 'Images/charon.webp' },
        { helper: true, helperColor: 0x775544 }
    ],
    [
        { name: 'Haumea', equatorialRadius: 1000, polarRadius: 750, parent: 'Sun' },
        {
            semiMajorAxis: 6.4525e9,
            eccentricity: 0.195,
            inclination: DEG_TO_RAD(28.19),
            argumentOfPeriapsis: DEG_TO_RAD(239.61),
            longitudeOfAscendingNode: DEG_TO_RAD(121.77),
            orbitalPeriod: DAY_TO_SEC(103000),
            axialTilt: DEG_TO_RAD(0),
            selfRotationPeriod: HOUR_TO_SEC(3.915)
        },
        { diffuseTextureUrl: 'Images/haumea.webp' },
        { helper: true, helperColor: 0xaaaaaa }
    ],
    [
        { name: 'Makemake', radius: 715, parent: 'Sun' },
        {
            semiMajorAxis: 6.8503e9,
            eccentricity: 0.159,
            inclination: DEG_TO_RAD(29.00685),
            argumentOfPeriapsis: DEG_TO_RAD(79.365),
            longitudeOfAscendingNode: DEG_TO_RAD(296.0),
            orbitalPeriod: DAY_TO_SEC(113000),
            axialTilt: DEG_TO_RAD(0),
            selfRotationPeriod: DAY_TO_SEC(7.77)
        },
        { diffuseTextureUrl: 'Images/make-make.webp' },
        { helper: true, helperColor: 0x884400 }
    ],
    [
        { name: 'Eris', radius: 1163, parent: 'Sun' },
        {
            semiMajorAxis: 10.117e9,
            eccentricity: 0.44177,
            inclination: DEG_TO_RAD(44.187),
            argumentOfPeriapsis: DEG_TO_RAD(151.89),
            longitudeOfAscendingNode: DEG_TO_RAD(35.951),
            orbitalPeriod: DAY_TO_SEC(204000),
            axialTilt: DEG_TO_RAD(0),
            selfRotationPeriod: DAY_TO_SEC(25.9)
        },
        { diffuseTextureUrl: 'Images/eris.webp' },
        { helper: true, helperColor: 0x555555 }
    ]
];