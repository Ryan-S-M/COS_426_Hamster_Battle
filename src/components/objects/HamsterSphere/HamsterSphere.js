import { Group, SphereGeometry, Mesh, MeshPhongMaterial, Vector3, Box3, Euler} from 'three';
import {Hamster} from '../Hamster';

class HamsterSphere extends Group {

    constructor(parent, radius, x, y, z, mass, color, isNPC) {
        super();

        this.name = 'HamsterSphere';

        this.velocity = new Vector3();
        this.radius = radius;
        this.mass = mass;
        this.position.set(x, y, z);
        this.direction = new Vector3(0, 0, -1);
        this.power = 1;

        this.netForce = new Vector3();
        this.lastNetForce = new Vector3();
        this.previous = new Vector3().copy(this.position);
        this.prevTime = -1;

        this.isNPC = isNPC;
        if (isNPC) {
          this.NPCTarget = null;
          this.NPCRandomness = 0;
          this.NPCNumFrames = 0;
        }
        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        this.geometry = new SphereGeometry(radius);
        this.material = new MeshPhongMaterial( {color: color, transparent: true, opacity:0.4} );
        
        this.add(new Mesh(this.geometry, this.material));

        this.hamster = new Hamster(parent, 0.4, 0, 0, 0.1);
        this.add(this.hamster);
        // this.hamster.model.position.multiplyScalar(0);

        parent.addToUpdateList(this);
        parent.addToSphereList(this);
    }
    update(timeStamp) {
        // set initial time
        if (this.prevTime == -1) {
            this.prevTime = timeStamp;
            return;
        }
        
        // fixed delta
        const deltaT = 0.03;

        // apply gravity and integrate
        this.applyGravity();

        this.integrate(deltaT);
        this.applyFriction();
        this.prevTime = timeStamp;
    }

    // otherBall is a HamsterSphere object
    collideBall(otherBall) {
        // first, determine if these balls are overlapping
        const diff = this.position.clone().sub(otherBall.position);
        if (diff.lengthSq() < (this.radius + otherBall.radius) * (this.radius + otherBall.radius)) {
            const diff_norm = diff.clone().normalize();
            const otherToInt = diff_norm.clone().multiplyScalar(diff.length() * otherBall.radius / (otherBall.radius + this.radius));
            const intersect = otherBall.position.clone().add(otherToInt);

            // step 1: move spheres apart
            this.position.copy(intersect.clone().add(diff_norm.clone().multiplyScalar(this.radius)));
            otherBall.position.copy(intersect.clone().sub(diff_norm.clone().multiplyScalar(otherBall.radius)));
            
            const u1 = diff_norm.dot(this.velocity);
            const u2 = diff_norm.dot(otherBall.velocity);

            const m1 = this.mass;
            const m2 = otherBall.mass;
            const v1 = (m1 - m2) / (m1 + m2) * u1 + 2 * m2 / (m1 + m2) * u2;
            const v2 = 2 * m1 / (m1 + m2) * u1 + (m2 - m1) / (m1 + m2) * u2;

            this.velocity.sub(diff_norm.clone().multiplyScalar(u1));
            otherBall.velocity.sub(diff_norm.clone().multiplyScalar(u2));

            this.velocity.add(diff_norm.clone().multiplyScalar(v1));
            otherBall.velocity.add(diff_norm.clone().multiplyScalar(v2));
        }
    }

    applyFriction() {
        this.addForce(this.velocity.clone().multiplyScalar(- this.mass))
    }

    // adapted from A5
    handleBoxCollision(box) {
        const boundingBox = new Box3().setFromObject(box);
        const posNoFriction = new Vector3();
        // not sure if we really need epsilon here
        const EPS = 0;
    
        // determine if particle is inside the box, plus EPS
        // to that end, expand the bounding box by EPS (in both directions)
        boundingBox.expandByVector(new Vector3(2 * EPS, 2 * EPS, 2 * EPS));
    
        // determine if any point on the sphere is inside the box
        // calculate by checking whether distance to nearest point in box is within radius
        // of the center
        // based on http://blog.nuclex-games.com/tutorials/collision-detection/static-sphere-vs-aabb/
        const closestPointInBox = boundingBox.max.clone().min(boundingBox.min.clone().max(this.position));
        const dist = closestPointInBox.clone().sub(this.position).lengthSq();
        if (dist < this.radius * this.radius) {
          const diff = this.position.clone().sub(closestPointInBox);  
          const dist1 = Math.abs(closestPointInBox.x - boundingBox.min.x);
          const dist2 = Math.abs(closestPointInBox.x - boundingBox.max.x);
          const dist3 = Math.abs(closestPointInBox.y - boundingBox.min.y);
          const dist4 = Math.abs(closestPointInBox.y - boundingBox.max.y);
          const dist5 = Math.abs(closestPointInBox.z - boundingBox.min.z);
          const dist6 = Math.abs(closestPointInBox.z - boundingBox.max.z);

          const minDist = Math.min(dist1, dist2, dist3, dist4, dist5, dist6);
    
          if (minDist == dist1) {
            posNoFriction.add(
              new Vector3(boundingBox.min.x, closestPointInBox.y, closestPointInBox.z)
            );
          } else if (minDist == dist2) {
            posNoFriction.add(
              new Vector3(boundingBox.max.x, closestPointInBox.y, closestPointInBox.z)
            );
          } else if (minDist == dist3) {
            posNoFriction.add(
              new Vector3(closestPointInBox.x, boundingBox.min.y, closestPointInBox.z)
            );
          } else if (minDist == dist4) {
            posNoFriction.add(
              new Vector3(closestPointInBox.x, boundingBox.max.y, closestPointInBox.z)
            );
          } else if (minDist == dist5) {
            posNoFriction.add(
              new Vector3(closestPointInBox.x, closestPointInBox.y, boundingBox.min.z)
            );
          } else if (minDist == dist6) {
            posNoFriction.add(
              new Vector3(closestPointInBox.x, closestPointInBox.y, boundingBox.max.z)
            );
          }
          // this should never happen, we'll just panic I guess
          else {
            console.log(
              "PANIC! This shouldn't have happened ever. Min should be one of options"
            );
          }

          this.position.copy(posNoFriction.add(diff.clone().normalize().multiplyScalar(this.radius)));

          // reflect velocity in this direction
          const reflectVel = diff.clone().normalize().multiplyScalar(- 1 * this.velocity.dot(diff.clone().normalize()));
          this.velocity.add(reflectVel);
        }
    }

    // applyGravity to this object
    applyGravity() {
        const GRAVITY = 9.88;
        const grav = new Vector3(0, -1, 0).multiplyScalar(this.mass * GRAVITY);
        this.addForce(grav);
    }

    // Integration, based on Verlet Integration in A5
    integrate(deltaT) {
        const DAMPING = 0.03;

        // find the difference between current and previous positions
        // modification: calculate velocity term

        // const diff = this.position.clone().sub(this.previous);
        const diff = this.velocity.clone();

        // update current position
        this.previous = this.position;

        // find acceleration
        const a = this.netForce.multiplyScalar(1 / this.mass);
    
        // apply formula
        diff.multiplyScalar(1 - DAMPING).multiplyScalar(deltaT);
        const a_scaled = a.clone().multiplyScalar(deltaT * deltaT);
        diff.add(a_scaled);
      this.position.copy(this.previous.clone().add(diff));
    
        this.lastNetForce.copy(this.netForce);
        this.netForce = new Vector3(0, 0, 0);

        this.velocity.add(a.multiplyScalar(deltaT));
    }

    // turn left
    turnLeft() {
        // THETA determines rotation speed
        const THETA = Math.PI / 10.0;
        const euler = new Euler(0, THETA, 0);
        const axis = new Vector3(0, 1, 0);
        this.direction.applyEuler(euler);
        this.hamster.rotateOnAxis(axis, THETA);
    }

    // turn right
    turnRight() {
        const THETA = -Math.PI / 10.0;
        const euler = new Euler(0, THETA, 0);
        const axis = new Vector3(0, 1, 0);
        this.direction.applyEuler(euler);
        this.hamster.rotateOnAxis(axis, THETA);
    }
    
    // apply forward force
    goForward() {
        this.addForce(this.direction.clone().multiplyScalar(this.power));
        // for loop because 1 animation per leg
        this.hamster.state.moving = 1;
        for (const anim of this.hamster.state.animations) {
          anim.play()
        } 
    }
    
    // add force
    addForce(force) {
        this.netForce.add(force);
    }

    // debuggging only, for the most part
    changePos(vec) {
        this.position.copy(vec);
        this.previous.copy(vec);
    }
    // also for debugging / testing
    setVel(vec) {
        this.velocity.copy(vec);
    }

    // all for debugging / testing
    setDirection(vec) {
        const v = vec.clone().normalize();
        const original = new Vector3(0, 0, -1);
        this.direction.copy(v);
        let theta = Math.acos(original.dot(v));

        const cross = original.clone().cross(v);
        if (cross.y < 0) {
            theta = - theta;
        }
        this.hamster.setRotationFromEuler(new Euler(0, theta, 0));
    }
    setPower(num) {
        this.power = num;
    }
    setRandomness(num) {
      this.NPCRandomness = num;
    }

}

export default HamsterSphere;