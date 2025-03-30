function Lerp(a, b, t) { return a + (b - a) * t; }

class AnimationKey
{
    constructor(targetPosition = null, targetRotation = null, duration, easingFunction)
    {
        this.targetPosition = targetPosition;
        this.targetRotation = targetRotation;
        this.duration = duration;
        this.easingFunction = easingFunction;
    }
}

class EasingFunctions
{
    static linear(t) { return t; }
    static easeInSine(t) { return 1 - Math.cos((t * Math.PI) / 2); }
    static easeOutSine(t) { return Math.sin((t * Math.PI) / 2); }
    static easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
    static easeInQuad(t) { return t * t; }
    static easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }
    static easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    static easeInCubic(t) { return t * t * t; }
    static easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    static easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    static easeInCirc(t) { return 1 - Math.sqrt(1 - t * t); }
    static easeOutCirc(t) { return Math.sqrt(1 - (t - 1) * (t - 1)); }
    static easeInOutCirc(t) { return t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2; }
}

/**
 * Animate the camera to a target position and rotation over a specified duration using an easing function.
 * @param {THREE.Camera} camera - The camera to animate.
 * @param {function} onComplete - Callback function to call when the animation is complete.
 * @param {AnimationKey} key - The animation key containing target position, rotation, duration, and easing function.
 * @constructor
 */
function AnimateCameraOnce(camera, key, onComplete)
{
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const endPosition = key.targetPosition ? key.targetPosition.clone() : null;
    const endRotation = key.targetRotation ? key.targetRotation.clone() : null;

    let startTime = null;

    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = (time - startTime) / 1000;

        if (elapsed < key.duration) {
            const t = elapsed / key.duration;
            const easedT = key.easingFunction(t);

            if (endPosition) { camera.position.lerpVectors(startPosition, endPosition, easedT); }

            if (endRotation) {
                camera.rotation.set(
                    Lerp(startRotation.x, endRotation.x, easedT),
                    Lerp(startRotation.y, endRotation.y, easedT),
                    Lerp(startRotation.z, endRotation.z, easedT)
                );
            }

            requestAnimationFrame(animate);
        } else {
            camera.position.copy(endPosition);
            if (endRotation) camera.rotation.copy(endRotation);
            if (onComplete) onComplete();
        }
    }

    requestAnimationFrame(animate);
}

/**
 * Animate the camera through a series of keys.
 * @param {THREE.Camera} camera - The camera to animate.
 * @param {function} onComplete - Callback function to call when the animation is complete.
 * @param {AnimationKey[]} keys - An array of animation keys containing target position, rotation, duration, and easing function.
 * @constructor
 */
function AnimateCamera(camera, keys, onComplete=null) {
    let currentKeyIndex = 0;

    function animateNextKey() {
        if (currentKeyIndex < keys.length)
        {
            AnimateCameraOnce(camera, keys[currentKeyIndex], () => { currentKeyIndex++; animateNextKey(); });
        }
        else { if (onComplete) onComplete(); }
    }

    animateNextKey();
}

/**
 * Focus the camera on a specific body. The body can move during the animation.
 * @param {THREE.Camera} camera - The camera to animate.
 * @param {CelestialBody} body - The celestial body to focus on.
 * @param {number} duration - Duration of the animation in seconds.
 * @param {function} onComplete - Callback function to call when the animation is complete.
 */
// TODO: Polish
function FocusCameraOnBody(camera, body, duration, onComplete=null)
{
    const bodyPosition = body.group.position.clone();
    let direction = new THREE.Vector3();
    direction.copy(camera.position).sub(bodyPosition).normalize();

    let targetPosition = bodyPosition.clone();
    targetPosition.add(direction.clone().multiplyScalar(body.radius * 2));

    const targetRotation = camera.rotation.clone();

    const key = new AnimationKey(
        targetPosition,
        targetRotation,
        duration,
        EasingFunctions.easeOutCirc
    );

    AnimateCameraOnce(camera, key, onComplete);
}