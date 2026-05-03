/**
 * Voice transport contract.
 *
 * Implementations:
 *  - LocalVoiceClient (current): captures local mic, emits levels, no networking.
 *  - WebRTCVoiceClient (future): SFU/mesh peer connections, remote audio tracks,
 *    room signaling, mute control. Same surface so UI does not change.
 */
export type SpeakerId = string;

export interface Speaker {
  id: SpeakerId;
  name: string;
  /** 0..1 instantaneous voice activity */
  level: number;
  speaking: boolean;
  muted: boolean;
  isLocal?: boolean;
}

export type VoiceEvent =
  | { type: "speakers"; speakers: Speaker[] }
  | { type: "local-level"; level: number }
  | { type: "ptt"; active: boolean }
  | { type: "error"; message: string };

export type VoiceListener = (e: VoiceEvent) => void;

export interface VoiceClient {
  /** Acquire mic, create transport. Idempotent. */
  connect(roomId: string, identity: { id: string; name: string }): Promise<void>;
  disconnect(): Promise<void>;

  /** Push-to-talk gating. When false, local audio is muted on the wire. */
  setPTT(active: boolean): void;

  /** Hard mute (independent from PTT). */
  setMuted(muted: boolean): void;

  /** Auto-mute everyone else while local user speaks (server policy hint). */
  setAutoDuckOthers(enabled: boolean): void;

  on(listener: VoiceListener): () => void;
}