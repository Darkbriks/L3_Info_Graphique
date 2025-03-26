const KM_BY_UNIT = 149597870.7 / 50000; // 1 Unité = 1 UA / 500 = 149597870.7 km / 500

function DEG_TO_RAD(deg) { return deg * Math.PI / 180; }
function DAY_TO_SEC(day) { return day * 24 * 3600; }
function HOUR_TO_SEC(hour) { return hour * 3600; }

class CelestialBody {
    static bodies = [];
    static textureLoader = new THREE.TextureLoader();
    static focusedBody = null;

    /**
     * Crée un corps céleste.
     * @param {Object} params - Les paramètres de l'objet.
     * @param {string} params.name - Le nom de l'objet.
     * @param {string} [params.parent=""] - Le nom du parent de l'objet (facultatif).
     * @param {number} params.radius - Le rayon de l'objet (en km).
     * @param {number} [params.equatorialRadius=params.radius] - Le rayon équatorial de l'objet (en km) (facultatif).
     * @param {number} [params.polarRadius=params.radius] - Le rayon polaire de l'objet (en km) (facultatif).
     * @param {Object} orbit - Les paramètres orbitaux de l'objet.
     * @param {number} orbit.semiMajorAxis - Le demi-grand axe de l'orbite (en km).
     * @param {number} orbit.eccentricity - L'excentricité de l'orbite.
     * @param {number} orbit.inclination - L'inclinaison de l'orbite (en radians).
     * @param {number} orbit.argumentOfPeriapsis - L'argument du périapsis de l'orbite (en radians).
     * @param {number} orbit.longitudeOfAscendingNode - La longitude du nœud ascendant de l'orbite (en radians).
     * @param {number} [orbit.meanAnomaly=0] - L'anomalie moyenne de l'objet (en radians) (facultatif).
     * @param {number} orbit.orbitalPeriod - La période orbitale de l'objet (en secondes).
     * @param {number} [orbit.axialTilt=0] - L'inclinaison de l'axe de rotation de l'objet (en radians) (facultatif).
     * @param {number} selfRotationPeriod - La période de rotation sur lui-même de l'objet (en secondes).
     * @param {Object} textures - Les textures pour l'objet.
     * @param {number} [textures.color=0xffffff] - La couleur de l'objet (facultatif).
     * @param {string} [textures.diffuseTextureUrl=""] - L'url de la texture diffuse (facultatif).
     * @param {string} [textures.normalTextureUrl=""] - L'url de la texture normale (facultatif).
     * @param {string} [textures.bumpTextureUrl=""] - L'url de la texture de bump (facultatif).
     * @param {number} [textures.bumpScale=0.05] - L'échelle de la texture de bump (facultatif).
     * @param {string} [textures.specularTextureUrl=""] - L'url de la texture spéculaire (facultatif).
     * @param {number} [textures.specularColor=0xffffff] - La couleur spéculaire (facultatif).
     * @param {string} [textures.alphaTextureUrl=""] - L'url de la texture alpha (facultatif).
     * @param {number} [textures.opacity=1] - L'opacité de l'objet (facultatif).
     * @param {boolean} [textures.transparent=false] - L'objet est-il transparent (facultatif).
     * @param {boolean} [textures.basicMaterial=false] - Utiliser un matériau basique (facultatif).
     * @param {number} [textures.blinnPhongExponent=16] - L'exposant de Blinn-Phong (facultatif).
     * @param {Object} [options] - Les options pour l'objet.
     * @param {boolean} [options.helper=false] - Afficher un helper pour l'orbite (facultatif).
     * @param {number} [options.helperColor=0xffffff] - La couleur de l'helper (facultatif).
     * @param {number} [options.helperNumSegments=500] - Le nombre de segments pour l'helper (facultatif).
     * @param {boolean} [options.lock=false] - Verrouiller la position de l'objet (facultatif).
     * @param {boolean} [options.createFocusButton=true] - Créer un bouton pour focus sur l'objet (facultatif).
     */
    constructor({
                    name,
                    parent = "",
                    radius,
                    equatorialRadius = radius,
                    polarRadius = radius,
                }, {
                    semiMajorAxis,
                    eccentricity,
                    inclination,
                    argumentOfPeriapsis,
                    longitudeOfAscendingNode,
                    meanAnomaly = 0,
                    orbitalPeriod,
                    axialTilt = 0,
                    selfRotationPeriod,
                }, {
                    color = 0xffffff,
                    diffuseTextureUrl = "",
                    normalTextureUrl = "",
                    bumpTextureUrl = "",
                    bumpScale = 0.05,
                    specularTextureUrl = "",
                    specularColor = 0xffffff,
                    alphaTextureUrl = "",
                    opacity = 1,
                    transparent = false,
                    basicMaterial = false,
                    blinnPhongExponent = 16,
                }, {
                    helper = false,
                    helperColor = 0xffffff,
                    helperNumSegments = 1000,
                    lock = false,
                    createFocusButton = true
                })
    {
        this.name = name;
        this.parent = CelestialBody.GetBodyByName(parent);
        this.radius = radius / KM_BY_UNIT;
        this.equatorialRadius = equatorialRadius / KM_BY_UNIT;
        this.polarRadius = polarRadius / KM_BY_UNIT;

        this.semiMajorAxis = semiMajorAxis / KM_BY_UNIT;
        this.eccentricity = eccentricity;
        this.inclination = inclination;
        this.argumentOfPeriapsis = 0;//argumentOfPeriapsis;  // FIXME
        this.longitudeOfAscendingNode = 0;//longitudeOfAscendingNode; // FIXME
        this.meanAnomaly = meanAnomaly;
        this.orbitalPeriod = orbitalPeriod;
        this.axialTilt = axialTilt;
        this.selfRotationPeriod = selfRotationPeriod;

        this.useHelper = helper;
        this.helperColor = helperColor;
        this.helperNumSegments = helperNumSegments;
        this.lock = lock;
        this.createFocusButton = createFocusButton;

        // Création du mesh avec une géométrie sphérique
        let geometry;
        if (equatorialRadius !== polarRadius)
        {
            const ellipsoid = (u, v, target) => {
                const theta = u * Math.PI * 2;
                const phi = v * Math.PI - Math.PI / 2;

                const x = this.equatorialRadius * Math.cos(theta) * Math.cos(phi);
                const y = this.equatorialRadius * Math.sin(theta) * Math.cos(phi) * (this.polarRadius / this.equatorialRadius);
                const z = this.polarRadius * Math.sin(phi);

                target.set(x, y, z);
            };
            geometry = new THREE.ParametricGeometry(ellipsoid, 32, 32);
        }
        else { geometry = new THREE.SphereGeometry(this.radius, 32, 32); }
        let material;

        const textureParams = {};
        textureParams.color = color;
        if (diffuseTextureUrl) { textureParams.map = CelestialBody.textureLoader.load(diffuseTextureUrl); }
        if (normalTextureUrl) { textureParams.normalMap = CelestialBody.textureLoader.load(normalTextureUrl); }
        if (bumpTextureUrl) { textureParams.bumpMap = CelestialBody.textureLoader.load(bumpTextureUrl); textureParams.bumpScale = bumpScale; }
        if (specularTextureUrl) { textureParams.specularMap = CelestialBody.textureLoader.load(specularTextureUrl); textureParams.specular = specularColor; }
        if (alphaTextureUrl) { textureParams.alphaMap = CelestialBody.textureLoader.load(alphaTextureUrl); textureParams.opacity = opacity; }
        textureParams.transparent = transparent;

        if (basicMaterial) { material = new THREE.MeshBasicMaterial(textureParams); }
        else { textureParams.shininess = blinnPhongExponent; material = new THREE.MeshPhongMaterial(textureParams); }

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.name;

        this.group = new THREE.Group();
        this.group.add(this.mesh);

        this.position = new THREE.Vector3(0, 0, 0);

        CelestialBody.bodies.push(this);
    }

    addRing({
                ringInnerRadius = 0,
                ringOuterRadius = 0,
                ringDiffuseTextureUrl = "",
                ringTransparencyTextureUrl = "",
                ringColor = 0xffffff,
            })
    {
        const innerRadius = ringInnerRadius / KM_BY_UNIT;
        const outerRadius = ringOuterRadius / KM_BY_UNIT;

        // Paramètres de découpage
        const segments = 128;
        const vertices = [];
        const indices = [];
        const uvs = [];
        const textureRepeat = 1;

        // Construction des sommets et des UV
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Coordonnées pour le bord intérieur
            const xInner = innerRadius * cos;
            const yInner = innerRadius * sin;
            // Coordonnées pour le bord extérieur
            const xOuter = outerRadius * cos;
            const yOuter = outerRadius * sin;

            vertices.push(xInner, yInner, 0);
            vertices.push(xOuter, yOuter, 0);

            const u = (angle / (2 * Math.PI)) * textureRepeat;
            uvs.push(u, 0);
            uvs.push(u, 1);
        }

        // Construction des indices pour les triangles
        for (let i = 0; i < segments; i++) {
            const a = i * 2;
            const b = a + 1;
            const c = a + 2;
            const d = a + 3;
            indices.push(a, b, d); // Premier triangle : a, b, d
            indices.push(a, d, c); // Deuxième triangle : a, d, c
        }

        // Création du geometry buffer
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Préparation du matériau avec répétition des textures
        const textureParams = { color: ringColor };
        if (ringDiffuseTextureUrl) {
            textureParams.map = CelestialBody.textureLoader.load(ringDiffuseTextureUrl, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                texture.rotation = -Math.PI / 2;
                texture.center.set(0.5, 0.5);
            });
        }
        if (ringTransparencyTextureUrl) {
            textureParams.alphaMap = CelestialBody.textureLoader.load(ringTransparencyTextureUrl, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                texture.rotation = -Math.PI / 2;
                texture.center.set(0.5, 0.5);
            });
            textureParams.transparent = true;
        }
        const ringMaterial = new THREE.MeshBasicMaterial(textureParams);
        ringMaterial.side = THREE.DoubleSide;

        // Création du mesh de l'anneau
        const ringMesh = new THREE.Mesh(geometry, ringMaterial);
        ringMesh.rotateX(DEG_TO_RAD(90));
        this.mesh.add(ringMesh);
    }

    init()
    {
        scene.add(this.group);
        this.mesh.rotateX(this.axialTilt);

        // Ajouter un bouton pour focus sur le corps céleste
        if (this.createFocusButton)
        {
            const button = document.createElement('button');
            button.textContent = this.name;
            button.onclick = () => { focusCameraOn(this); };
            document.getElementById('focus-buttons').appendChild(button);
        }

        if (this.useHelper) { this.createOrbitHelper(); }
    }

    static initAll() { CelestialBody.bodies.forEach(body => { body.init(); }); }

    /**
     * Met à jour la rotation sur lui-même du corps céleste.
     * @param {number} time - Le temps écoulé (en secondes).
     */
    updateRotation(time) { this.mesh.rotation.y = (time / this.selfRotationPeriod) * Math.PI * 2; }

    static updateAllRotation(time) { CelestialBody.bodies.forEach(body => { body.updateRotation(time); }); }

    /**
     * Met à jour la position orbitale
     * @param {number} time - Le temps écoulé (en secondes ou dans l'unité choisie).
     */
    updatePosition(time)
    {
        if (this.lock) return;

        // Calcul de l'anomalie moyenne
        const meanMotion = 2 * Math.PI / this.orbitalPeriod;
        const meanAnomaly = this.meanAnomaly + meanMotion * time;

        // Résolution de l'équation de Kepler (méthode de Newton-Raphson)
        let E = meanAnomaly;
        let delta = 1;
        let i = 0;
        while (Math.abs(delta) > 1e-6)
        {
            delta = (E - this.eccentricity * Math.sin(E) - meanAnomaly) / (1 - this.eccentricity * Math.cos(E));
            E -= delta;
            i++;
            if (i > 4) { console.log('L\'équation de Kepler ne converge pas pour', this.name); break; }
        }

        // Calcul de l'anomalie vraie
        const theta = 2 * Math.atan(Math.sqrt((1 + this.eccentricity) / (1 - this.eccentricity)) * Math.tan(E / 2));

        let { x, z, y } = this.thetaToCartesian(theta);

        // Ajout de la position du parent si existant
        if (this.parent)
        {
            const parentPosition = this.parent.position;
            x += parentPosition.x;
            y += parentPosition.y;
            z += parentPosition.z;
        }

        this.position.set(x, y, z);
    }

    static updateAllPosition(time)
    {
        CelestialBody.bodies.forEach(body => { body.updatePosition(time); });
        CelestialBody.bodies.forEach(body =>
        {
            if (body === CelestialBody.focusedBody)
            {
                body.group.position.set(0, 0, 0);
            }
            else
            {
                body.group.position.set(
                    body.position.x - CelestialBody.focusedBody.position.x,
                    body.position.y - CelestialBody.focusedBody.position.y,
                    body.position.z - CelestialBody.focusedBody.position.z);
            }
        })
    }

    createOrbitHelper()
    {
        const points = [];
        const segments = this.helperNumSegments;

        for (let i = 0; i <= segments; i++) { points.push(this.thetaToCartesian((i / segments) * Math.PI * 2)); }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: this.helperColor });
        this.orbitHelper = new THREE.Line(geometry, material);

        if (this.parent) { this.parent.group.add(this.orbitHelper); }
        else { scene.add(this.orbitHelper); }
        // TODO: Utiliser des groupes pour éviter les problèmes de rotation
        console.log('Orbit helper created for', this.name);
    }

    thetaToCartesian(theta)
    {
        // Coordonnées polaires
        const r = (this.semiMajorAxis * (1 - this.eccentricity ** 2)) / (1 + this.eccentricity * Math.cos(theta));
        const xprime = r * Math.cos(theta);
        const yprime = r * Math.sin(theta);

        // Variables temporaires pour les calculs
        const cosOmega = Math.cos(this.longitudeOfAscendingNode);
        const sinOmega = Math.sin(this.longitudeOfAscendingNode);
        const cosOmegaP = Math.cos(this.argumentOfPeriapsis);
        const sinOmegaP = Math.sin(this.argumentOfPeriapsis);
        const cosI = Math.cos(this.inclination);
        const sinI = Math.sin(this.inclination);

        // Coordonnées cartésiennes
        const x = xprime * (cosOmega * cosOmegaP - sinOmega * sinOmegaP * cosI) - yprime * (cosOmega * sinOmegaP + sinOmega * cosOmegaP * cosI);
        const y = xprime * (sinOmega * cosOmegaP + cosOmega * sinOmegaP * cosI)+  yprime * (sinOmega * sinOmegaP - cosOmega * cosOmegaP * cosI);
        const z = xprime * (sinOmegaP * sinI) + yprime * (cosOmegaP * sinI);

        return new THREE.Vector3(x, z, y);
    }

    static GetBodyByName(name)
    {
        for (let i = 0; i < CelestialBody.bodies.length; i++)
        {
            if (CelestialBody.bodies[i].name === name) { return CelestialBody.bodies[i]; }
        }
        return null;
    }
}

function focusCameraOn(body)
{
    control.target = body.group.position;
    cameraTarget = body.group;
    camera.lookAt(cameraTarget.position);
    CelestialBody.focusedBody = body;
    console.log('Focused on', body.name);
}