import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";

/**
 * Controller for subtle, natural body gestures (head nods, neck tilts, chest movement)
 * during character speech to make the avatar look realistic and alive.
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
    const targetWeight = volume > 0.015 ? Math.min(1.0, volume * 2.5 + 0.2) : 0.0;
    this._speakingWeight += (targetWeight - this._speakingWeight) * Math.min(1.0, delta * 6.0);

    if (this._speakingWeight < 0.001) return;

    const t = this._elapsedTime;
    const w = this._speakingWeight;

    // Humanoid Bone Nodes
    const head = this._vrm.humanoid.getNormalizedBoneNode("head");
    const neck = this._vrm.humanoid.getNormalizedBoneNode("neck");
    const chest = this._vrm.humanoid.getNormalizedBoneNode("chest");
    const spine = this._vrm.humanoid.getNormalizedBoneNode("spine");

    // Head: Gentle speech nods & subtle tilts
    if (head) {
      head.rotation.x += Math.sin(t * 4.5) * 0.035 * w; // subtle nod
      head.rotation.z += Math.cos(t * 2.8) * 0.02 * w;  // subtle side tilt
      head.rotation.y += Math.sin(t * 3.2) * 0.025 * w; // subtle head turn
    }

    // Neck: Micro-tilt
    if (neck) {
      neck.rotation.x += Math.sin(t * 4.0) * 0.015 * w;
    }

    // Chest: Natural speech breath & chest cadence
    if (chest) {
      chest.rotation.x += (Math.sin(t * 2.5) * 0.015 + 0.008) * w;
      chest.rotation.y += Math.cos(t * 2.0) * 0.012 * w;
    }

    // Spine: Very subtle body swaying
    if (spine) {
      spine.rotation.x += Math.sin(t * 2.2) * 0.008 * w;
    }
  }
}
