import React from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { Message } from "@/features/messages/messages";
import {
  KoeiroParam,
  PRESET_A,
  PRESET_B,
  PRESET_C,
  PRESET_D,
} from "@/features/constants/koeiroParam";
import { Link } from "./link";

type Props = {
  openAiKey: string;
  systemPrompt: string;
  chatLog: Message[];
  koeiroParam: KoeiroParam;
  koeiromapKey: string;
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiroParam: (x: number, y: number) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
  onChangeKoeiromapKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const Settings = ({
  openAiKey,
  chatLog,
  systemPrompt,
  koeiroParam,
  koeiromapKey,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  onChangeKoeiroParam,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
  onChangeKoeiromapKey,
}: Props) => {
  return (
    <div className="futuristic-settings-modal">
      <div className="absolute top-0 left-0 m-24 z-50">
        <IconButton
          iconName="24/Close"
          className="futuristic-menu-btn"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto scroll-hidden">
        <div className="max-w-3xl mx-auto px-24 py-64">
          <div className="my-24 text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3 border-b border-rose-500/30 pb-16">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            Pengaturan Aplikasi
          </div>

          {/* Custom Provider API Key Card */}
          <div className="futuristic-settings-card">
            <div className="futuristic-settings-title">🔑 Kunci API Custom Provider</div>
            <input
              className="futuristic-settings-input mb-12"
              type="text"
              placeholder="Masukkan Kunci API Custom Provider Anda..."
              value={openAiKey}
              onChange={onChangeAiKey}
            />
            <div className="text-xs text-neutral-400 leading-relaxed">
              Custom Provider API diakses secara aman. Kunci API tidak disimpan di server luar.
              <br />
              ※ Model AI yang digunakan adalah <strong>gemini/gemini-3-flash-preview</strong>.
            </div>
          </div>

          {/* Model Karakter Card */}
          <div className="futuristic-settings-card">
            <div className="futuristic-settings-title">👤 Model Karakter 3D (VRM)</div>
            <div className="text-xs text-neutral-300 mb-16">
              Unggah file avatar 3D (.vrm) milik Anda sendiri untuk mengganti karakter default.
            </div>
            <button className="futuristic-action-btn" onClick={onClickOpenVrmFile}>
              📁 Buka File VRM
            </button>
          </div>

          {/* System Prompt Card */}
          <div className="futuristic-settings-card">
            <div className="flex flex-wrap items-center justify-between gap-12 mb-16">
              <div className="futuristic-settings-title !mb-0">🤖 Instruksi Karakter (System Prompt)</div>
              <button className="futuristic-action-btn" onClick={onClickResetSystemPrompt}>
                ↺ Reset Instruksi
              </button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="futuristic-settings-textarea"
            ></textarea>
          </div>

          {/* Voice TTS Status Card */}
          <div className="futuristic-settings-card">
            <div className="futuristic-settings-title">🔊 Penyesuaian Suara (TTS)</div>
            <div className="text-sm text-neutral-200">
              Sintesis suara diproses secara real-time menggunakan Custom Provider <strong>gemini/gemini-3.1-flash-tts-preview</strong> (Suara Laki-Laki: <em>Puck / echo</em>).
            </div>
          </div>

          {/* Chat Log History Editing Card */}
          {chatLog.length > 0 && (
            <div className="futuristic-settings-card">
              <div className="flex flex-wrap items-center justify-between gap-12 mb-16">
                <div className="futuristic-settings-title !mb-0">💬 Riwayat Percakapan</div>
                <button className="futuristic-action-btn" onClick={onClickResetChatLog}>
                  🗑️ Reset Riwayat
                </button>
              </div>
              <div className="space-y-12">
                {chatLog.map((value, index) => {
                  const isAssistant = value.role === "assistant";
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-12"
                    >
                      <div className={`w-24 text-xs font-mono font-bold px-8 py-4 rounded-md text-center flex-shrink-0 ${isAssistant ? "bg-rose-900/80 text-rose-200 border border-rose-500/30" : "bg-neutral-800 text-neutral-300 border border-neutral-700"}`}>
                        {isAssistant ? "AI" : "Anda"}
                      </div>
                      <input
                        className="futuristic-settings-input"
                        type="text"
                        value={value.content}
                        onChange={(event) => {
                          onChangeChatLog(index, event.target.value);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
