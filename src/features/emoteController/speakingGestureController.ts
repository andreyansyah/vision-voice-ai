import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";

/**
 * Controller for procedural, natural arm and hand gestures during character speech.
 */
export class SpeakingGestureController {
  private _vrm: VRM;
  private _elapsedTime: number = 0;
  private _speakingWeight: number = 0;

  constructor(vrm: VRM) {
    this._vrm = vrm;
  }

  public update(delta: number, volume: number): void {
    this._elapsedTime += delta;

    // Smoothly transition speaking weight (1.0 when speaking, 0.0 when silent)
    const targetWeight = volume > 0.015 ? Math.min(1.0, volume * 3.5 + 0.3) : 0.0;
    this._speakingWeight += (targetWeight - this._speakingWeight) * Math.min(1.0, delta * 8.0);

    if (this._speakingWeight < 0.001) return;

    const t = this._elapsedTime;
    const w = this._speakingWeight;

    // Humanoid Bone Nodes
    const leftUpperArm = this._vrm.humanoid.getNormalizedBoneNode("leftUpperArm");
    const rightUpperArm = this._vrm.humanoid.getNormalizedBoneNode("rightUpperArm");
    const leftLowerArm = this._vrm.humanoid.getNormalizedBoneNode("leftLowerArm");
    const rightLowerArm = this._vrm.humanoid.getNormalizedBoneNode("rightLowerArm");
    const leftHand = this._vrm.humanoid.getNormalizedBoneNode("leftHand");
    const rightHand = this._vrm.humanoid.getNormalizedBoneNode("rightHand");

    // Left Arm & Hand procedural speaking gestures
    if (leftUpperArm) {
      leftUpperArm.rotation.x += Math.sin(t * 3.5) * 0.12 * w;
      leftUpperArm.rotation.y += Math.cos(t * 2.8) * 0.1 * w;
      leftUpperArm.rotation.z += Math.sin(t * 2.2) * 0.08 * w;
    }

    if (leftLowerArm) {
      leftLowerArm.rotation.x += (0.2 + Math.sin(t * 4.2) * 0.15) * w;
      leftLowerArm.rotation.y += Math.cos(t * 3.0) * 0.1 * w;
    }

    if (leftHand) {
      leftHand.rotation.z += Math.sin(t * 5.0) * 0.12 * w;
      leftHand.rotation.x += Math.cos(t * 4.5) * 0.08 * w;
    }

    // Right Arm & Hand procedural speaking gestures
    if (rightUpperArm) {
      rightUpperArm.rotation.x += Math.cos(t * 3.8) * 0.12 * w;
      rightUpperArm.rotation.y -= Math.sin(t * 2.6) * 0.1 * w;
      rightUpperArm.rotation.z -= Math.cos(t * 2.4) * 0.08 * w;
    }

    if (rightLowerArm) {
      rightLowerArm.rotation.x += (0.2 + Math.cos(t * 4.0) * 0.15) * w;
      rightLowerArm.rotation.y -= Math.sin(t * 3.2) * 0.1 * w;
    }

    if (rightHand) {
      rightHand.rotation.z -= Math.sin(t * 4.8) * 0.12 * w;
      rightHand.rotation.x += Math.sin(t * 4.2) * 0.08 * w;
    }
  }
}
