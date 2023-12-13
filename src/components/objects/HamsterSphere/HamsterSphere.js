import { Group, SphereGeometry, Mesh, MeshPhongMaterial, Vector3, Box3, Euler} from 'three';
import {Hamster} from '../Hamster';

class HamsterSphere extends Group {

    constructor(parent, radius, x, y, z, mass) {
        super();

        this.name = 'HamsterSphere';

        this.velocity = new Vector3();
        this.radius = radius;
        this.mass = mass;
        this.position.set(x, y, z);
        this.direction = new Vector3(0, 0, -1);

        this.netForce = new Vector3();
        this.lastNetForce = new Vector3();
        this.previous = new Vector3().copy(this.position);
        this.prevTime = -1;

        // add an array of objects we're touching
        // this.touching = [];

        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        const geometry = new SphereGeometry(radius);
        const material = new MeshPhongMaterial( {color: 0xffee44, transparent: true, opacity:0.4} );
        
        // const cubeA = new THREE.Mesh( geometry, material );
        this.add(new Mesh(geometry, material));

        this.hamster = new Hamster(0.4, 0, 0, 0.1);
        this.add(this.hamster);
        // this.hamster.model.position.multiplyScalar(0);

        parent.addToUpdateList(this);
        parent.addToSphereList(this);
    }
    update(timeStamp) {
        // console.log("update() called");
        // set initial time
        if (this.prevTime == -1) {
            this.prevTime = timeStamp;
            return;
        }
        // console.log("position: ", this.position);
        // console.log("deltaT: ", (timeStamp - this.prevTime) / 500.0)
        
        // fixed delta
        const deltaT = 0.03;

        // apply gravity and integrate
        this.applyGravity();

        // calculate normal forces
        // alternate to remove

        // this.touching = this.touching.filter(obj => obj.isTouchingSphere(this.position, this.radius)[0]);
        // let array = [1, 2, 3];
        // array = array.filter(entry => entry < 2);
        // console.log(array);
        // for (const obj of this.touching) {
        //     let [isTouching, diff] = obj.isTouchingSphere(this.position, this.radius) 
        //     // console.log("touching at time ", timeStamp);
        //     // console.log("hey");
        //     console.log("net force before normal: ", this.netForce);

        //     const normalForce = diff.clone().normalize().multiplyScalar(- this.netForce.dot(diff.clone().normalize()))
        //     // this.addForce(normalForce);
        //     console.log("normalForce: ", normalForce);
        //     console.log("dot: ", this.netForce.dot(diff));
        //     console.log("diff is", diff);
        //     console.log("net force after: ", this.netForce);
            
        // }
        
        // 200 seems to work well, at least initially for falling distances
        // this.verletIntegrate((timeStamp - this.prevTime) / 500.0);
        // console.log("about to integrate");
        this.verletIntegrate(deltaT);
        this.prevTime = timeStamp;
    }

    // otherBall is a HamsterSphere object
    collideBall(otherBall) {
        // first, determine if these balls are overlapping
        const diff = this.position.clone().sub(otherBall.position);
        // console.log("diff length: ", diff.length());
        if (diff.lengthSq() < (this.radius + otherBall.radius) * (this.radius + otherBall.radius)) {
            // console.log("overlapping spheres!!");
            const diff_norm = diff.clone().normalize();
            // const neg_diff_norm = diff_norm.clone().multiplyScalar(-1);
            const otherToInt = diff_norm.clone().multiplyScalar(diff.length() * otherBall.radius / (otherBall.radius + this.radius));
            const intersect = otherBall.position.clone().add(otherToInt);

            // step 1: move spheres apart
            this.position.copy(intersect.clone().add(diff_norm.clone().multiplyScalar(this.radius)));
            otherBall.position.copy(intersect.clone().sub(diff_norm.clone().multiplyScalar(otherBall.radius)));
            
            // const u1 = neg_diff_norm.dot(this.velocity);
            const u1 = diff_norm.dot(this.velocity);
            const u2 = diff_norm.dot(otherBall.velocity);

            const m1 = this.mass;
            const m2 = otherBall.mass;
            console.log("m1", m1);
            console.log("m2", m2);
            console.log("u1, ", u1);
            console.log("u2, ", u2);
            const v1 = (m1 - m2) / (m1 + m2) * u1 + 2 * m2 / (m1 + m2) * u2;
            const v2 = 2 * m1 / (m1 + m2) * u1 + (m2 - m1) / (m1 + m2) * u2;
            console.log("v1, ", v1);
            console.log("v2, ", v2);

            // this.velocity.sub(neg_diff_norm.clone().multiplyScalar(u1));
            this.velocity.sub(diff_norm.clone().multiplyScalar(u1));
            otherBall.velocity.sub(diff_norm.clone().multiplyScalar(u2));

            this.velocity.add(diff_norm.clone().multiplyScalar(v1));
            // otherBall.velocity.add(neg_diff_norm.clone().multiplyScalar(v2));
            otherBall.velocity.add(diff_norm.clone().multiplyScalar(v2));
        }
    }

    // adapted from A5
    handleBoxCollision(box) {
        // console.log("box: ", box);
        // const boundingBox = box.geometry.boundingBox.clone();
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
        // const thisPos = this.getWorldPosition();
        // console.log("my position: ", this.position);
        // console.log("bounding Box: ", boundingBox);
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
        //   console.log("\n***************************************")
        //   console.log("before intersecting: ", this.position);
        //   console.log("posNoFriction: ", posNoFriction);
        //   console.log("diff: ", diff);
          this.position.copy(posNoFriction.add(diff.clone().normalize().multiplyScalar(this.radius)));
          
        //   if (!this.touching.includes(box)) {
        //     this.touching.push(box);
        //   }

          // reflect velocity in this direction
          // TODO: FIGURE OUT WHY THIS DOESN"T WORK WITH RADIUS > 1
          const reflectVel = diff.clone().normalize().multiplyScalar(- 1 * this.velocity.dot(diff.clone().normalize()));
          this.velocity.add(reflectVel);





          // hacky?
          // approximate force applied to box
        //   console.log("diff:", diff);
        //   console.log("last net force: ", this.lastNetForce);
        //   this.addForce(diff.clone().multiplyScalar(- diff.dot(this.lastNetForce)));
        //   console.log("After intersecting: ", this.position);
        //   console.log("\n***************************************")

        }
    }

    // applyGravity to this object
    applyGravity() {
        const GRAVITY = 9.88;
        const grav = new Vector3(0, -1, 0).multiplyScalar(this.mass * GRAVITY);
        this.addForce(grav);
    }

    // Verlet Integration, based on A5
    verletIntegrate(deltaT) {
        // console.log("verlet called()");
        // console.log("net force is ", this.netForce);
        // console.log("net force: ", this.netForce);
        // console.log("previous: ", this.previous);
        // console.log("current position: ", this.position)
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


         // update velocity term
        //  console.log("acceleration: ", a);
        //  console.log("velocity: ", this.velocity);
         this.velocity.add(a.multiplyScalar(deltaT));

        //  if (this.previous.equals(this.position) && Math.abs(this.lastNetForce.length()) < 0.001) {
        //     this.velocity = new Vector3();
        //  }

    }

    // turn left
    turnLeft() {

    }

    // turn right
    turnRight() {

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
        // const axis = new Vector3(0, -1, 0);
        this.direction.copy(v);
        let theta = Math.acos(original.dot(v));

        const cross = original.clone().cross(v);
        console.log("cross: ", cross);
        if (cross.y < 0) {
            theta = - theta;
            console.log("negating");
        }
        // console.log("dot product: ", original.dot(v));
        this.hamster.setRotationFromEuler(new Euler(0, theta, 0));
    }


}

export default HamsterSphere;