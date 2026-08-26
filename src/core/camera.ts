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
import { Matrix4 } from "../math/matrix";

export interface Camera {
  position: Vector3,
  rotation: Quaternion,
  projectionMatrix: Matrix4,
  viewMatrix: Matrix4,
  viewProjectionMatrix: Matrix4
}

export class PerspectiveCamera implements Camera {
  public position: Vector3;
  public rotation: Quaternion;

  public fov: number;
  public aspectRatio: number;

  public near: number;
  public far: number;

  public projectionMatrix = new Matrix4();
  public viewMatrix = new Matrix4();
  public viewProjectionMatrix = new Matrix4();

  constructor(fov: number = 60, aspectRatio: number = 16 / 9, near: number = 0.1, far: number = 1000, position: Vector3 = new Vector3(0, 0, 0), rotation: Quaternion = Quaternion.identity()) {
    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.near = near;
    this.far = far;

    this.position = position;
    this.rotation = rotation;

    this.updateProjectionMatrix();
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    Matrix4.getPerspectiveMatrix(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far,
      this.projectionMatrix
    );
  }

  public updateViewMatrix(): void {
    const conjugateRotation = this.rotation.conjugate();
    const rotationMatrix = Matrix4.fromQuaternion(conjugateRotation);
    const translationMatrix = Matrix4.fromVector3(this.position);

    Matrix4.multiply(rotationMatrix, translationMatrix, this.viewMatrix);
  }

  public updateViewProjectionMatrix(): void {
    Matrix4.multiply(this.projectionMatrix, this.viewMatrix, this.viewProjectionMatrix);
  }
}

export class OrthographicCamera implements Camera {
  public position: Vector3;
  public rotation: Quaternion;

  public left: number;
  public right: number;
  public top: number;
  public bottom: number;
  public near: number;
  public far: number;

  public projectionMatrix = new Matrix4();
  public viewMatrix = new Matrix4();
  public viewProjectionMatrix = new Matrix4();

  constructor(width: number, aspectRatio: number = 16 / 9, near: number = -1, far: number = 1, position: Vector3 = new Vector3(0, 0, 0), rotation: Quaternion = Quaternion.identity()) {
    this.left = -width / 2;
    this.right = width / 2;
    this.top = -(width / aspectRatio) / 2;
    this.bottom = (width / aspectRatio) / 2;
    this.near = near;
    this.far = far;

    this.position = position;
    this.rotation = rotation;

    this.updateProjectionMatrix();
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    Matrix4.getOrthographicMatrix(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far,
      this.projectionMatrix
    );
  }

  public updateViewMatrix(): void {
    const conjugateRotation = this.rotation.conjugate();
    const rotationMatrix = Matrix4.fromQuaternion(conjugateRotation);
    const translationMatrix = Matrix4.fromVector3(this.position);

    Matrix4.multiply(rotationMatrix, translationMatrix, this.viewMatrix);
  }

  public updateViewProjectionMatrix(): void {
    Matrix4.multiply(this.projectionMatrix, this.viewMatrix, this.viewProjectionMatrix);
  }
}
