/** Different Camera types. */

// export enum CameraType {
//   /** First Person Shooter style camera. What it looks like if you were ACTUALLY in the scene. */
//   FPS,
//   /** Orbital camera. Spins around a designated target. */
//   Orbit,
//   /** TODO: Smart camera that changes based on the contents in the scene. */
//   Smart,
// }

// type CameraProps = {
//   [CameraType.FPS]: {
//     speed: number;
//     sensitivity: number;
//   };
//   [CameraType.Orbit]: {
//     target: [number, number, number];
//     speed: number;
//     distance: number;
//   };
//   [CameraType.Smart]: {
//     targets: any[];
//   };
// };

// class CameraImpl {
//   public position: [number, number, number] = [0, 0, 0];

//   constructor(type: CameraType) {
//     if (type === CameraType.Orbit) {
//       Object.assign(this, {
//         target: [0, 0, 0],
//         speed: 15,
//         distance: 10,
//       });
//     } else if (type === CameraType.FPS) {
//       Object.assign(this, {
//         speed: 5.0,
//         sensitivity: 0.002,
//       });
//     } else if (type === CameraType.Smart) {
//       Object.assign(this, {
//         targets: [],
//       });
//     }
//   }
// }

// export type Camera<T extends CameraType = CameraType> = CameraImpl &
//   CameraProps[T];
// export const Camera = CameraImpl as new <T extends CameraType>(
//   type: T,
// ) => Camera<T>;



import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";

export interface Camera {
  position: Vector3,
  rotation: Quaternion
}

export class PerspectiveCamera implements Camera {
  public position: Vector3;
  public rotation: Quaternion;

  constructor(position: Vector3 = new Vector3(0, 0, 0), rotation: Quaternion = Quaternion.identity()) {
    this.position = position;
    this.rotation = rotation;
  }
}

export class OrthographicCamera implements Camera {
  public position: Vector3;
  public rotation: Quaternion;

  constructor(position: Vector3 = new Vector3(0, 0, 0), rotation: Quaternion = Quaternion.identity()) {
    this.position = position;
    this.rotation = rotation;
  }
}