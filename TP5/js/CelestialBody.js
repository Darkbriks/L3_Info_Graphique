const KM_BY_UNIT = 149597870.7 / 50000; // 1 Unité = 1 UA / 500 = 149597870.7 km / 500

function DEG_TO_RAD(deg) { return deg * Math.PI / 180; }
function DAY_TO_SEC(day) { return day * 24 * 3600; }

class CelestialBody {
    static bodies = [];
    static textureLoader = new THREE.TextureLoader();

    /**
     * Crée un corps céleste.
     * @param {Object} params - Les paramètres pour configurer l'objet.
     * @param {string} params.name - Le nom du corps céleste.
     * @param {number} params.radius - Le rayon du corps (en kilomètres).
     * @param {number} params.semiMajorAxis - L’axe semi-majeur de l’orbite (en kilomètres).
     * @param {number} params.eccentricity - L’excentricité de l’orbite (sans unité).
     * @param {number} params.inclination - L’inclinaison de l’orbite (en radians).
     * @param {number} params.argumentOfPeriapsis - L'argument du périapside (en radians).
     * @param {number} params.longitudeOfAscendingNode - La longitude du nœud ascendant (en radians).
     * @param {number} params.orbitalPeriod - La période orbitale (en secondes).
     * @param {string} [params.parent=""] - Le corps parent autour duquel orbite cet objet (facultatif).
     * @param {number} params.axialTilt - L'inclinaison de l'axe de rotation (en radians).
     * @param {number} params.selfRotationPeriod - La période de rotation sur lui-même (en secondes).
     * @param {string} params.textureUrl - URL de la texture pour le mesh (facultatif).
     * @param {boolean} [basicMaterial=false] - Utiliser un matériau de base (facultatif).
     * @param {boolean} [helper=false] - Utiliser un helper pour l'orbite (facultatif).
     * @param {number} [helperColor=0xffffff] - Couleur du helper (facultatif).
     * @param {number} [helperNumSegments=500] - Nombre de segments pour le helper (facultatif).
     * @param {boolean} [lock=false] - Bloquer la position orbitale (facultatif).
     */
    constructor({
                    name,
                    radius,
                    semiMajorAxis,
                    eccentricity,
                    inclination,
                    argumentOfPeriapsis,
                    longitudeOfAscendingNode,
                    orbitalPeriod,
                    parent = "",
                    axialTilt = 0,
                    selfRotationPeriod,
                    textureUrl,
                    basicMaterial = false,
                    helper = false,
                    helperColor = 0xffffff,
                    helperNumSegments = 500,
                    lock = false
                })
    {
        this.name = name;
        this.radius = radius / KM_BY_UNIT;
        this.semiMajorAxis = semiMajorAxis / KM_BY_UNIT;
        this.eccentricity = eccentricity;
        this.inclination = inclination;
        this.argumentOfPeriapsis = 0;//argumentOfPeriapsis;  // FIXME
        this.longitudeOfAscendingNode = 0;//longitudeOfAscendingNode; // FIXME
        this.meanAnomaly = 0;
        this.orbitalPeriod = orbitalPeriod;
        this.parent = CelestialBody.GetBodyByName(parent);
        this.axialTilt = axialTilt;
        this.selfRotationPeriod = selfRotationPeriod;
        this.lock = lock;
        this.useHelper = helper;
        this.helperColor = helperColor;
        this.helperNumSegments = helperNumSegments;

        // Création du mesh avec une géométrie sphérique
        const geometry = new THREE.SphereGeometry(this.radius, 24, 24);
        let material;

        if (basicMaterial) { material = new THREE.MeshBasicMaterial({map: CelestialBody.textureLoader.load(textureUrl)}); }
        else
        {
            if (textureUrl) { material = new THREE.MeshPhongMaterial({map: CelestialBody.textureLoader.load(textureUrl)}); }
            else { material = new THREE.MeshPhongMaterial({color: 0xffffff}); }
        }

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.name;

        CelestialBody.bodies.push(this);
    }

    init()
    {
        scene.add(this.mesh);
        this.mesh.rotateX(this.axialTilt);

        // Ajouter un bouton pour focus sur le corps céleste
        const button = document.createElement('button');
        button.textContent = this.name;
        button.onclick = () => { focusCameraOn(this); };
        document.getElementById('focus-buttons').appendChild(button);

        if (this.useHelper) { this.createOrbitHelper(); }
    }

    static initAll() { CelestialBody.bodies.forEach(body => { body.init(); }); }

    /**
     * Met à jour la rotation sur lui-même du corps céleste.
     * @param {number} time - Le temps écoulé (en secondes).
     */
    updateRotation(time)
    {
        this.mesh.rotation.y += time / this.selfRotationPeriod;
        // TODO: Synchroniser avec le temps réel
    }

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
            const parentPosition = this.parent.mesh.position;
            x += parentPosition.x;
            y += parentPosition.y;
            z += parentPosition.z;
        }

        this.mesh.position.set(x, y, z);
    }

    static updateAllPosition(time) { CelestialBody.bodies.forEach(body => { body.updatePosition(time); }); }

    createOrbitHelper()
    {
        const points = [];
        const segments = this.helperNumSegments;

        for (let i = 0; i <= segments; i++) { points.push(this.thetaToCartesian((i / segments) * Math.PI * 2)); }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: this.helperColor });
        this.orbitHelper = new THREE.Line(geometry, material);

        if (this.parent) { this.parent.mesh.add(this.orbitHelper); }
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
    control.target = body.mesh.position;
    cameraTarget = body.mesh;
    cameraTargetLastPosition = body.position.clone();

    camera.position.x = cameraTarget.position.x;
    camera.position.y = cameraTarget.position.y;
    camera.position.z = cameraTarget.position.z;
    camera.lookAt(cameraTarget.position);
}