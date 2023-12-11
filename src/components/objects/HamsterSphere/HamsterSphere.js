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
        // console.log("deltaT: ", (timeStamp - this.prevTime) / 500.0)
        
        // fixed delta
        const deltaT = 0.05;

        // apply gravity and integrate
        this.applyGravity();
        // 200 seems to work well, at least initially for falling distances
        // this.verletIntegrate((timeStamp - this.prevTime) / 500.0);
        this.verletIntegrate(deltaT);
        this.prevTime = timeStamp;

    }


    // otherBall is a HamsterSphere object
    collideBall(otherBall) {
        
    }

    // adapted from A5
    handleBoxCollision(box) {
        const boundingBox = box.geometry.boundingBox.clone();
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
          this.position.copy(posNoFriction.add(diff.normalize().multiplyScalar(this.radius)));
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
        // console.log("net force: ", this.netForce);
        // console.log("previous: ", this.previous);
        // console.log("current position: ", this.position)
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
        this.previous.copy(vec);
    }
    // also for debugging / testing
    setVel(vec) {
        this.velocity.copy(vec);
    }


}

export default HamsterSphere;