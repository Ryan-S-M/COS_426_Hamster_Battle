import { Group, SphereGeometry, Mesh, MeshPhongMaterial, Vector3} from 'three';

class HamsterSphere extends Group {

    constructor(parent, radius, x, y, z, mass) {
        super();

        this.name = 'HamsterSphere';

        this.velocity = new Vector3();
        this.radius = radius;
        this.mass = mass;
        this.position.set(x, y, z);

        this.netForce = new Vector3();
        this.previous = new Vector3().copy(this.position);
        this.prevTime = -1;


        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        const geometry = new SphereGeometry(radius);
        const material = new MeshPhongMaterial( {color: 0xffee44, transparent: true, opacity:0.4} );
        
        // const cubeA = new THREE.Mesh( geometry, material );
        this.add(new Mesh(geometry, material));

        parent.addToUpdateList(this);
        parent.addToSphereList(this);
    }
    update(timeStamp) {
        // set initial time
        if (this.prevTime == -1) {
            this.prevTime = timeStamp;
            return;
        }
        console.log("position: ", this.position);

        // apply gravity and integrate
        this.applyGravity();
        // 200 seems to work well, at least initially for falling distances
        this.verletIntegrate((timeStamp - this.prevTime) / 500.0);
        this.prevTime = timeStamp;

    }


    // otherBall is a HamsterSphere object
    collideBall(otherBall) {
        
    }

    handleBoxCollision(box) {
    //     // if (!box.mesh.visible) return;
    //     // const friction = SceneParams.friction;
        // console.log("box: ", box);
        const boundingBox = box.geometry.boundingBox.clone();
        const posNoFriction = new Vector3();
    //     const boundingBox = box.boundingBox.clone();
    //     // const EPS = 10; // empirically determined
        const EPS = 0;
    
    //     // Handle collision of this particle with the axis-aligned box.
    //     // As before, use EPS to prevent clipping
    //     // const posFriction = new THREE.Vector3();
    //     const posNoFriction = new THREE.Vector3();
    //     // -------------- STUDENT CODE BEGIN ---------------
    //     // Our reference solution uses 66 lines of code.
    
    //     // determine if particle is inside the box, plus EPS
    //     // to that end, expand the bounding box by EPS (in both directions)
        boundingBox.expandByVector(new Vector3(2 * EPS, 2 * EPS, 2 * EPS));
    
        // determine if any point on the sphere is inside the box
        // calculate by checking whether distance to nearest point in box is within radius
        // of the center
        // based on http://blog.nuclex-games.com/tutorials/collision-detection/static-sphere-vs-aabb/
        const closestPointInBox = boundingBox.max.clone().min(boundingBox.min.clone().max(this.position));
        const dist = closestPointInBox.sub(this.position).lengthSq();
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
              new Vector3(boundingBox.min.x, this.position.y, this.position.z)
            );
          } else if (minDist == dist2) {
            posNoFriction.add(
              new Vector3(boundingBox.max.x, this.position.y, this.position.z)
            );
          } else if (minDist == dist3) {
            posNoFriction.add(
              new Vector3(this.position.x, boundingBox.min.y, this.position.z)
            );
          } else if (minDist == dist4) {
            posNoFriction.add(
              new Vector3(this.position.x, boundingBox.max.y, this.position.z)
            );
          } else if (minDist == dist5) {
            posNoFriction.add(
              new Vector3(this.position.x, this.position.y, boundingBox.min.z)
            );
          } else if (minDist == dist6) {
            posNoFriction.add(
              new Vector3(this.position.x, this.position.y, boundingBox.max.z)
            );
          }
          // this should never happen, we'll just panic I guess
          else {
            console.log(
              "PANIC! This shouldn't have happened ever. Min should be one of options"
            );
          }
        
          this.position.copy(posNoFriction.add(diff));
          console.log("After intersecting: ", this.position);
        }

        // this.position.clone().
        // 
        // Vector3.Min(Vector3.Max(sphereCenter, aabbMin), aabbMax);

    //     if (boundingBox.containsPoint(this.position)) {
    //       // Step 1: find no friction position
    //       // Step 1a: find the nearest position on the box
    
    //       const dist1 = Math.abs(this.position.x - boundingBox.min.x);
    //       const dist2 = Math.abs(this.position.x - boundingBox.max.x);
    //       const dist3 = Math.abs(this.position.y - boundingBox.min.y);
    //       const dist4 = Math.abs(this.position.y - boundingBox.max.y);
    //       const dist5 = Math.abs(this.position.z - boundingBox.min.z);
    //       const dist6 = Math.abs(this.position.z - boundingBox.max.z);
    
    //       const minDist = Math.min(dist1, dist2, dist3, dist4, dist5, dist6);
    
    //       if (minDist == dist1) {
    //         posNoFriction.add(
    //           new THREE.Vector3(boundingBox.min.x, this.position.y, this.position.z)
    //         );
    //       } else if (minDist == dist2) {
    //         posNoFriction.add(
    //           new THREE.Vector3(boundingBox.max.x, this.position.y, this.position.z)
    //         );
    //       } else if (minDist == dist3) {
    //         posNoFriction.add(
    //           new THREE.Vector3(this.position.x, boundingBox.min.y, this.position.z)
    //         );
    //       } else if (minDist == dist4) {
    //         posNoFriction.add(
    //           new THREE.Vector3(this.position.x, boundingBox.max.y, this.position.z)
    //         );
    //       } else if (minDist == dist5) {
    //         posNoFriction.add(
    //           new THREE.Vector3(this.position.x, this.position.y, boundingBox.min.z)
    //         );
    //       } else if (minDist == dist6) {
    //         posNoFriction.add(
    //           new THREE.Vector3(this.position.x, this.position.y, boundingBox.max.z)
    //         );
    //       }
    //       // this should never happen, we'll just panic I guess
    //       else {
    //         console.log(
    //           "PANIC! This shouldn't have happened ever. Min should be one of options"
    //         );
    //       }
    
    //       // Step 2: check if the particle was in the box last time
    //       // Step 2a: if yes, calculate the friction position (note that the box doesn't move)
    //       if (!boundingBox.containsPoint(this.previous)) {
    //         posFriction.add(this.previous);
    //         this.position = posNoFriction
    //           .multiplyScalar(1 - friction)
    //           .add(posFriction.multiplyScalar(friction));
    //       }
    //       // Step 2b: if no, set the position to be the no friction position
    //       else {
    //         this.position = posNoFriction;
    //       }
    //     }
    }



    // applyGravity to this object
    applyGravity() {
        const GRAVITY = 9.88;
        const grav = new Vector3(0, -1, 0).multiplyScalar(this.mass * GRAVITY);
        this.addForce(grav);
    }

    // Verlet Integration, based on A5
    verletIntegrate(deltaT) {
        const DAMPING = 0.03;

        // find the difference between current and previous positions
        const diff = this.position.clone().sub(this.previous);
    
        // update current position
        this.previous = this.position;
    
        // find acceleration
        const a = this.netForce.multiplyScalar(1 / this.mass);
    
        // apply formula
        diff.multiplyScalar(1 - DAMPING);
        a.multiplyScalar(deltaT * deltaT);
        diff.add(a);
        this.position.copy(this.previous.clone().add(diff));
    
        this.netForce = new Vector3(0, 0, 0);
    }

    // add force
    addForce(force) {
        this.netForce.add(force);
    }

    // debuggging only, for the most part
    changePos(vec) {
        this.position.copy(vec);
    }


}

export default HamsterSphere;