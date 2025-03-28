class Characters
{
    /**
     * Classe représentant un joueur dans le jeu.
     * @param {Object} params - Les paramètres de l'objet.
     * @param {string} [params.parent=""] - Le nom du parent de l'objet (facultatif).
     * @param {number} [params.latitude=0] - La latitude de l'objet (facultatif).
     * @param {number} [params.longitude=0] - La longitude de l'objet (facultatif).
     * @param {number} [params.speed=10] - La vitesse de l'objet (facultatif).
     * @param {number} [params.color=0xffffff] - La couleur de l'objet (facultatif).
     */
    constructor({
                    parent = "",
                    latitude = 0,
                    longitude = 0,
                    speed = 10,
                    color = 0xffffff,
                })
    {
        this.parent = CelestialBody.GetBodyByName(parent);

        this.distance = this.parent.radius * 0.1;
        this.latitude = latitude; // -90 South, 0 Equator, 90 North
        this.longitude = longitude; // -180 West, 0 Prime Meridian, 180 East

        this.speed = speed;
        this.timeBetweenShots = 0.25;
        this.cooldown = 0;
        //this.longitudeSpeed = 30;
        this.latitudeSpeed = 15;

        const geometry = new THREE.SphereGeometry(10/KM_BY_UNIT, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });

        this.mesh = new THREE.Mesh(geometry, material);

        this.group = new THREE.Group();
        this.group.add(this.mesh);
    }

    init()
    {
        scene.add(this.group);
        this.group.rotateX(this.parent.axialTilt + (90 * Math.PI / 180));
    }

    update(deltaTime)
    {
        this.cooldown -= deltaTime;

        // Si espace est appuyé, tirer un projectile
        if (keys[" "] && this.cooldown <= 0)
        {
            this.cooldown = this.timeBetweenShots;
            const projectile = new Projectile({
                parent: this.parent.name,
                lifeTime: 5,
                latitude: this.latitude,
                longitude: this.longitude,
            });
            projectile.init();
        }

        //if (keys["ArrowUp"] || keys["z"]) { this.longitude -= this.longitudeSpeed * deltaTime; }
        //if (keys["ArrowDown"] || keys["s"]) { this.longitude += this.longitudeSpeed * deltaTime; }
        if (keys["ArrowLeft"] || keys["q"]) { this.latitude += this.latitudeSpeed * deltaTime; }
        if (keys["ArrowRight"] || keys["d"]) { this.latitude -= this.latitudeSpeed * deltaTime; }
        this.latitude = Clamp(this.latitude, -75, 75);
        this.longitude -= this.speed * deltaTime;

        SetPositionOnSphere(this);
        this.group.quaternion.setFromRotationMatrix(GetRotationMatrixFromSphere(this));
        this.group.rotateY(120 * Math.PI / 180);

        Projectile.updateAll(deltaTime);
    }
}

class Enemy
{
    static enemies = [];

    constructor({ parent = "", color = 0xff0000, life = 1, latitude = 0, longitude = 0 })
    {
        this.parent = CelestialBody.GetBodyByName(parent);
        this.distance = this.parent.radius * 0.1;
        this.color = color;
        this.life = life;
        this.latitude = latitude;
        this.longitude = longitude;

        const geometry = new THREE.SphereGeometry(50/KM_BY_UNIT, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });

        this.mesh = new THREE.Mesh(geometry, material);

        this.group = new THREE.Group();
        this.group.add(this.mesh);
    }

    init()
    {
        scene.add(this.group);
        Enemy.enemies.push(this);
    }

    static updateAll(deltaTime)
    {
        for (let i = 0; i < Enemy.enemies.length; i++)
        {
            const enemy = Enemy.enemies[i];
            enemy.update(deltaTime);
            if (enemy.life <= 0)
            {
                scene.remove(enemy.group);
                Enemy.enemies.splice(i, 1);
                i--;
            }
        }
    }

    update(deltaTime)
    {
        //this.longitude -= 10 * deltaTime;

        SetPositionOnSphere(this);
        this.group.quaternion.setFromRotationMatrix(GetRotationMatrixFromSphere(this));

        for (let i = 0; i < Projectile.projectiles.length; i++)
        {
            const projectile = Projectile.projectiles[i];
            const distance = projectile.group.position.distanceTo(this.group.position);
            if (distance < (this.mesh.geometry.parameters.radius + projectile.mesh.geometry.parameters.radius))
            {
                this.life--;
                scene.remove(projectile.group);
                Projectile.projectiles.splice(i, 1);
                i--;
            }
        }
    }
}

class Projectile
{
    static projectiles = [];

    constructor({ parent = "", color = 0xffffff, lifeTime = 10, latitude = 0, longitude = 0, speed = 50 })
    {
        this.parent = CelestialBody.GetBodyByName(parent);
        this.distance = this.parent.radius * 0.1;
        this.color = color;
        this.lifeTime = lifeTime;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;

        const geometry = new THREE.SphereGeometry(5/KM_BY_UNIT, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });

        this.mesh = new THREE.Mesh(geometry, material);

        this.group = new THREE.Group();
        this.group.add(this.mesh);
    }

    init()
    {
        scene.add(this.group);
        Projectile.projectiles.push(this);
    }

    static updateAll(deltaTime)
    {
        for (let i = 0; i < Projectile.projectiles.length; i++)
        {
            const projectile = Projectile.projectiles[i];
            projectile.update(deltaTime);
            if (projectile.lifeTime <= 0)
            {
                scene.remove(projectile.group);
                Projectile.projectiles.splice(i, 1);
                i--;
            }
        }
    }

    update(deltaTime)
    {
        this.lifeTime -= deltaTime;
        this.longitude -= this.speed * deltaTime;

        SetPositionOnSphere(this);
        this.group.quaternion.setFromRotationMatrix(GetRotationMatrixFromSphere(this));
    }
}

function Clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function SetPositionOnSphere(object)
{
    const radius = object.parent.radius + object.distance;
    const phi = (90 - object.latitude) * (Math.PI / 180);
    const theta = (object.longitude + 180) * (Math.PI / 180);
    const x = radius * Math.sin(phi) * Math.cos(theta) + object.parent.group.position.x;
    const y = radius * Math.cos(phi) + object.parent.group.position.y;
    const z = radius * Math.sin(phi) * Math.sin(theta) + object.parent.group.position.z;
    object.group.position.set(x, y, z);
}

function GetRotationMatrixFromSphere(object)
{
    const center = new THREE.Vector3(
        object.parent.group.position.x,
        object.parent.group.position.y,
        object.parent.group.position.z
    );

    const upVector = new THREE.Vector3(0, 1, 0); // Direction arbitraire pour définir l'orientation
    const forwardVector = new THREE.Vector3().subVectors(center, object.group.position).normalize(); // Vecteur pointant vers le centre
    const rightVector = new THREE.Vector3().crossVectors(upVector, forwardVector).normalize(); // Vecteur perpendiculaire

    // Calculer la nouvelle orientation en utilisant une matrice de rotation
    const upAdjusted = new THREE.Vector3().crossVectors(forwardVector, rightVector).normalize();
    return new THREE.Matrix4().makeBasis(rightVector, upAdjusted, forwardVector);
}