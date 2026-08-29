import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";
import { Matrix4 } from "../math/matrix";

export interface Camera {
  position: Vector3;
  rotation: Quaternion;
  projectionMatrix: Matrix4;
  viewMatrix: Matrix4;
  viewProjectionMatrix: Matrix4;
  resize(width: number, height: number): void;
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

  constructor(
    fov: number = 60,
    aspectRatio: number = 16 / 9,
    near: number = 0.1,
    far: number = 1000,
    position: Vector3 = new Vector3(0, 0, 0),
    rotation: Quaternion = Quaternion.identity(),
  ) {
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

  public update(): void {
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    Matrix4.getPerspectiveMatrix(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far,
      this.projectionMatrix,
    );
  }

  private updateViewMatrix(): void {
    const conjugateRotation = this.rotation.conjugate(new Quaternion());
    const rotationMatrix = Matrix4.fromQuaternion(conjugateRotation);

    const translationMatrix = new Matrix4();
    translationMatrix.data[12] = -this.position.x;
    translationMatrix.data[13] = -this.position.y;
    translationMatrix.data[14] = -this.position.z;

    Matrix4.multiply(rotationMatrix, translationMatrix, this.viewMatrix);
  }

  public resize(width: number, height: number): void {
    if (height <= 0) return;
    this.aspectRatio = width / height;
    this.updateProjectionMatrix();
    this.updateViewProjectionMatrix();
  }

  private updateViewProjectionMatrix(): void {
    Matrix4.multiply(
      this.projectionMatrix,
      this.viewMatrix,
      this.viewProjectionMatrix,
    );
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

  constructor(
    width: number,
    aspectRatio: number = 16 / 9,
    near: number = -1,
    far: number = 1,
    position: Vector3 = new Vector3(0, 0, 0),
    rotation: Quaternion = Quaternion.identity(),
  ) {
    this.left = -width / 2;
    this.right = width / 2;
    this.top = width / aspectRatio / 2;
    this.bottom = -(width / aspectRatio) / 2;
    this.near = near;
    this.far = far;

    this.position = position;
    this.rotation = rotation;

    this.updateProjectionMatrix();
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  public update(): void {
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  private updateProjectionMatrix(): void {
    Matrix4.getOrthographicMatrix(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far,
      this.projectionMatrix,
    );
  }

  private updateViewMatrix(): void {
    const conjugateRotation = this.rotation.conjugate(new Quaternion());
    const rotationMatrix = Matrix4.fromQuaternion(conjugateRotation);

    const translationMatrix = new Matrix4();
    translationMatrix.data[12] = -this.position.x;
    translationMatrix.data[13] = -this.position.y;
    translationMatrix.data[14] = -this.position.z;

    Matrix4.multiply(rotationMatrix, translationMatrix, this.viewMatrix);
  }

  public updateViewProjectionMatrix(): void {
    Matrix4.multiply(
      this.projectionMatrix,
      this.viewMatrix,
      this.viewProjectionMatrix,
    );
  }

  resize(width: number, height: number): void {
    if (height <= 0) return;

    this.left = -width / 2;
    this.right = width / 2;
    this.top = height / 2;
    this.bottom = -height / 2;

    this.updateProjectionMatrix();
    this.updateViewProjectionMatrix();
  }
}
