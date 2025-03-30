class GameObject
{
    constructor({ parent = "", color = 0xffffff, latitude = 0, longitude = 0, size = 10 })
    {
        this.parent = CelestialBody.GetBodyByName(parent);
        this.distance = this.parent.radius * 0.1;
        this.color = color;
        this.latitude = latitude;
        this.longitude = longitude;

        const geometry = new THREE.SphereGeometry(size / KM_BY_UNIT, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: color });

        this.mesh = new THREE.Mesh(geometry, material);
        this.group = new THREE.Group();
        this.group.add(this.mesh);
    }

    dispose()
    {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        scene.remove(this.group);
        this.group = null;
        this.mesh = null;
    }

    init() { scene.add(this.group); }

    updatePosition()
    {
        // Calcul de la position en coordonnées sphériques
        const radius = this.parent.radius + this.distance;
        const phi = (90 - this.latitude) * (Math.PI / 180);
        const theta = (this.longitude + 180) * (Math.PI / 180);

        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.cos(phi);
        let z = radius * Math.sin(phi) * Math.sin(theta);

        // Appliquer l'inclinaison de l'axe de la planète
        const tiltAngle = this.parent.axialTilt;
        const tiltMatrix = new THREE.Matrix4().makeRotationX(tiltAngle);

        let position = new THREE.Vector3(x, y, z);
        position.applyMatrix4(tiltMatrix);

        // Ajouter la position de la planète pour obtenir la position globale
        position.add(this.parent.group.position);
        this.group.position.copy(position);

        const down = new THREE.Vector3().subVectors(this.parent.group.position, this.group.position).normalize();
        const up = new THREE.Vector3(0, 1, 0).applyMatrix4(tiltMatrix).normalize();
        const right = new THREE.Vector3().crossVectors(up, down).normalize();
        const upAdjusted = new THREE.Vector3().crossVectors(down, right).normalize();
        const rotationMatrix = new THREE.Matrix4().makeBasis(right, upAdjusted, down);
        this.group.quaternion.setFromRotationMatrix(rotationMatrix);
    }

}

class Player extends GameObject
{
    constructor(params)
    {
        super({ ...params, size: 10 });
        this.life = 5;
        this.immuneTime = 0.2;
        this.damageCooldown = 0;
        this.shield = 0;
        this.speed = params.speed || 10;
        this.timeBetweenShots = 0.25;
        this.cooldown = 0;
        this.latitudeSpeed = 10;
        this.projectile = params.projectile || BasicProjectile;
    }

    dispose() { this.group.remove(camera); super.dispose(); }

    takeDamage(damage)
    {
        if (this.damageCooldown > 0) { return; }
        if (this.shield > 0)
        {
            this.shield -= damage;
            if (this.shield < 0) { this.life += this.shield; this.shield = 0; }
        }
        else { this.life -= damage; }
        this.mesh.material.transparent = true;
        this.mesh.material.opacity = 0.5;
        this.damageCooldown = this.immuneTime;
    }

    update(deltaTime)
    {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads ? gamepads[0] : null;

        this.cooldown -= deltaTime;
        this.damageCooldown -= deltaTime;

        if (this.damageCooldown <= 0)
        {
            this.mesh.material.transparent = false;
            this.mesh.material.opacity = 1;
        }

        if ((keys[" "] || (gamepad && gamepad.buttons[0].pressed) || (gamepad && gamepad.buttons[1].pressed)) && this.cooldown <= 0)
        {
            this.cooldown = this.timeBetweenShots;
            if (this.projectile) { this.projectile(this); }
        }

        const axisX = gamepad ? gamepad.axes[0] : 0;
        if (axisX > 0.1) { this.latitude += this.latitudeSpeed * deltaTime * -axisX; }
        else if (axisX < -0.1) { this.latitude -= this.latitudeSpeed * deltaTime * axisX; }
        else
        {
            if (keys["ArrowLeft"] || keys["q"]) { this.latitude += this.latitudeSpeed * deltaTime; }
            else if (keys["ArrowRight"] || keys["d"]) { this.latitude -= this.latitudeSpeed * deltaTime; }
        }

        this.latitude = Clamp(this.latitude, -75, 75);
        this.longitude -= this.speed * deltaTime;


        this.updatePosition();
        this.group.rotateY(120 * Math.PI / 180);

        for (let enemy of Enemy.enemies)
        {
            if (this.group.position.distanceTo(enemy.group.position) < this.mesh.geometry.parameters.radius + enemy.mesh.geometry.parameters.radius)
            {
                this.takeDamage(1);
                enemy.life--;
            }
        }

        if (this.life <= 0 && this.life > -999)
        {
            ClearScene();
            currentLevelUpdate = null;
            DisplayDeathMenu();
        }

        if (keys["a"]) { this.life = 0; }
    }
}

class Enemy extends GameObject
{
    static enemies = [];

    constructor(params)
    {
        super({ ...params, size: 50, color: 0xff0000 });
        this.life = params.life || 1;
        this.projectile = params.projectile;
        this.timeBetweenShots = params.timeBetweenShots || 1;
        this.cooldown = 0;

        // Optionnel : liste de waypoints
        // Chaque waypoint doit contenir : { latitude, longitude, duration, easing }
        this.waypoints = params.waypoints || [];
        this.currentWaypointIndex = 0;
        this.currentWaypointTime = 0;
        // Position de départ pour l'interpolation
        this.startLatitude = this.latitude;
        this.startLongitude = this.longitude;
    }

    init() { super.init(); Enemy.enemies.push(this); }

    update(deltaTime)
    {
        if (this.waypoints.length > 0 && this.currentWaypointIndex < this.waypoints.length)
        {
            const wp = this.waypoints[this.currentWaypointIndex];
            this.currentWaypointTime += deltaTime;
            let t = Math.min(this.currentWaypointTime / wp.duration, 1);
            let easedT = wp.easing ? wp.easing(t) : t;
            this.latitude = this.startLatitude + (wp.latitude - this.startLatitude) * easedT;
            this.longitude = this.startLongitude + (wp.longitude - this.startLongitude) * easedT;

            if (t >= 1)
            {
                this.latitude = wp.latitude;
                this.longitude = wp.longitude;
                this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;
                this.currentWaypointTime = 0;
                this.startLatitude = this.latitude;
                this.startLongitude = this.longitude;
            }
        }

        this.cooldown -= deltaTime;
        if (this.cooldown <= 0)
        {
            this.cooldown = this.timeBetweenShots;
            if (this.projectile) { this.projectile(this, -1); }
        }

        this.updatePosition();
    }

    static updateAll(deltaTime)
    {
        for (let i = 0; i < Enemy.enemies.length; i++)
        {
            const enemy = Enemy.enemies[i];
            enemy.update(deltaTime);
            if (enemy.life <= 0)
            {
                enemy.dispose();
                Enemy.enemies.splice(i, 1);
                killEnemies++;
                i--;
            }
        }
    }
}

class Projectile extends GameObject
{
    static projectiles = [];
    static enemiesProjectiles = [];

    constructor(params)
    {
        super({ ...params, size: 5 });
        this.lifeTime = params.lifeTime || 5;
        this.speed = params.speed || 50;
        this.spawnByPlayer = params.spawnByPlayer || false;
    }

    init()
    {
        super.init();
        Projectile.projectiles.push(this);
        if (!this.spawnByPlayer) { Projectile.enemiesProjectiles.push(this); }
    }

    update(deltaTime)
    {
        this.lifeTime -= deltaTime;
        this.longitude -= this.speed * deltaTime;
        this.updatePosition();

        for (let i = 0; i < Enemy.enemies.length; i++)
        {
            const enemy = Enemy.enemies[i];
            if (this.spawnByPlayer && this.group.position.distanceTo(enemy.group.position) < this.mesh.geometry.parameters.radius*2 + enemy.mesh.geometry.parameters.radius)
            {
                this.lifeTime = 0;
                enemy.life--;
            }
            else if (!this.spawnByPlayer &&this.group.position.distanceTo(player.group.position) < this.mesh.geometry.parameters.radius + player.mesh.geometry.parameters.radius)
            {
                this.lifeTime = 0;
                player.takeDamage(1);
            }
        }

        if (this.spawnByPlayer)
        {
            for (let i = 0; i < Projectile.enemiesProjectiles.length; i++)
            {
                const projectile = Projectile.enemiesProjectiles[i];
                if (this.group.position.distanceTo(projectile.group.position) < this.mesh.geometry.parameters.radius*2 + projectile.mesh.geometry.parameters.radius*2)
                {
                    this.lifeTime = 0;
                    projectile.lifeTime = 0;
                }
            }
        }
    }

    static updateAll(deltaTime)
    {
        for (let i = 0; i < Projectile.projectiles.length; i++) { const projectile = Projectile.projectiles[i]; projectile.update(deltaTime); }
        for (let i = 0; i < Projectile.projectiles.length; i++)
        {
            const projectile = Projectile.projectiles[i];
            if (projectile.lifeTime <= 0)
            {
                projectile.dispose();
                Projectile.projectiles.splice(i, 1);
                if (!projectile.spawnByPlayer) { Projectile.enemiesProjectiles.splice(Projectile.enemiesProjectiles.findIndex(p => p === projectile), 1); }
                i--;
            }
        }
    }
}

// Power-up classes
// A power-up is a special item that can be collected by the player to gain a temporary advantage or ability.
// If the player collects a power-up, it will be removed for a fixed amount of time, and then it will reappear.
class PowerUp extends GameObject
{
    constructor(params)
    {
        super({ ...params, size: 75 });
        this.duration = params.duration || 5;
        this.cooldown = 0;
        this.active = false;

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = 0.25;
    }

    init()
    {
        super.init();
        PowerUp.powerUps.push(this);
        this.updatePosition();
    }

    static updateAll(deltaTime) { for (let i = 0; i < PowerUp.powerUps.length; i++) { PowerUp.powerUps[i].update(deltaTime); } }

    update(deltaTime)
    {
        if (!this.active)
        {
            this.cooldown -= deltaTime;
            if (this.cooldown <= 0)
            {
                this.cooldown = 0;
                this.active = true;
                this.group.visible = true;
            }
        }
        else
        {
            if (this.group.position.distanceTo(player.group.position) < this.mesh.geometry.parameters.radius + player.mesh.geometry.parameters.radius)
            {
                this.active = false;
                this.cooldown = this.duration;
                this.group.visible = false;
                this.applyEffect();
            }
        }
    }

    applyEffect() { console.log("Power-up effect not implemented"); }

    static powerUps = [];
}

class LifePowerUp extends PowerUp
{
    constructor(params)
    {
        super({ ...params, color: 0x00ffff });
        this.effect = params.effect || 1;
    }

    applyEffect() { player.life += this.effect; }
}

class InvincibilityPowerUp extends PowerUp
{
    constructor(params)
    {
        super({ ...params, color: 0xff00ff });
        this.effect = params.effect || 5;
        this.playerLife = 0;
        this.playerShield = 0;
    }

    applyEffect()
    {
        this.playerLife = player.life;
        this.playerShield = player.shield;
        player.life = -9999;
        player.shield = -9999;
        setTimeout(() => { player.life = this.playerLife; player.shield = this.playerShield }, this.effect * 1000);
    }
}

class ShootSpeedPowerUp extends PowerUp
{
    constructor(params)
    {
        super({ ...params, color: 0x0000ff });
        this.effect = params.effect || 5;
        this.playerCooldown = 0;
    }

    applyEffect()
    {
        this.playerCooldown = player.timeBetweenShots;
        player.timeBetweenShots /= 5;
        setTimeout(() => { player.timeBetweenShots = this.playerCooldown; }, this.effect * 1000);
    }
}

class ShieldPowerUp extends PowerUp
{
    constructor(params)
    {
        super({ ...params, color: 0xffff00 });
        this.effect = params.effect || 5;
        this.playerShield = 0;
    }

    applyEffect()
    {
        this.playerShield = player.shield;
        player.shield += this.effect;
        setTimeout(() => { player.shield = this.playerShield; }, this.effect * 1000);
    }
}

function BasicProjectile(object, dir = 1)
{
    const projectile = new Projectile(
        {
            parent: object.parent.name,
            latitude: object.latitude,
            longitude: object.longitude,
            lifeTime: 1,
            speed: 50 * dir,
            spawnByPlayer: object instanceof Player,
        });
    projectile.speed = projectile.parent.name === "Saturn" ? 20 * dir : projectile.speed;
    projectile.init();
    return projectile;
}

function Clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }