import { useCallback, useEffect, useRef, useState } from "react";
import { getVoiceClient } from "@/lib/voice/LocalVoiceClient";
import type { Speaker } from "@/lib/voice/types";

export interface UseVoiceOptions {
  roomId: string;
  identity: { id: string; name: string };
  autoDuckOthers?: boolean;
}

export const useVoice = ({ roomId, identity, autoDuckOthers = true }: UseVoiceOptions) => {
  const client = getVoiceClient();
  const [level, setLevel] = useState(0);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [pttActive, setPttActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!connectedRef.current) {
      connectedRef.current = true;
      client.connect(roomId, identity);
    }
    client.setAutoDuckOthers(autoDuckOthers);
    const off = client.on((e) => {
      if (e.type === "local-level") setLevel(e.level);
      else if (e.type === "speakers") setSpeakers(e.speakers);
      else if (e.type === "ptt") setPttActive(e.active);
      else if (e.type === "error") setError(e.message);
    });
    return () => {
      off();
    };
  }, [client, roomId, identity, autoDuckOthers]);

  const startTalking = useCallback(() => client.setPTT(true), [client]);
  const stopTalking = useCallback(() => client.setPTT(false), [client]);

  const activeSpeaker = speakers.find((s) => s.speaking) ?? null;

  return { level, speakers, pttActive, error, activeSpeaker, startTalking, stopTalking };
};