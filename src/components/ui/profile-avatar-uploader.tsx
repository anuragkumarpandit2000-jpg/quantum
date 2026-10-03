"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Edit3, X, UploadCloud, CheckCircle2 } from "lucide-react";
import AvatarCropModal from "@/components/ui/avatar-crop-modal";
import { cn } from "@/lib/utils";

interface ProfileAvatarUploaderProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ProfileAvatarUploader: React.FC<ProfileAvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  className,
  size = "md",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const displayAvatar =
    currentAvatar || "/assets/images/avatars/default_avatar.svg";

  const sizeDimensions = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }[size];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTempImageSrc(event.target.result as string);
        setIsCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2.5", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Circular Avatar Container with Hover Overlay & Drag-Drop */}
      <div
        className={cn(
          "relative rounded-full border-2 transition-all duration-300 group cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.2)] aspect-square",
          sizeDimensions,
          isDraggingOver
            ? "border-sky-400 scale-105 shadow-[0_0_25px_rgba(56,189,248,0.5)]"
            : "border-sky-400/40 hover:border-sky-400"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        title="Click or drop photo to reposition & set avatar"
      >
        {/* Current Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayAvatar}
          alt="Profile Avatar"
          className="w-full h-full object-cover object-center"
        />

        {/* Hover / Drag Overlay */}
        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-sky-400 gap-1 p-1">
          {isDraggingOver ? (
            <>
              <UploadCloud size={18} className="animate-bounce" />
              <span className="text-[9px] font-mono font-bold tracking-tight text-white">
                DROP HERE
              </span>
            </>
          ) : (
            <>
              <Camera size={18} />
              <span className="text-[9px] font-mono tracking-tight text-white text-center">
                {currentAvatar ? "CHANGE" : "UPLOAD"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Buttons / Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-sky-400/50 text-slate-300 hover:text-white font-mono text-[11px] flex items-center gap-1.5 transition"
        >
          <Camera size={12} className="text-sky-400" />
          <span>{currentAvatar ? "Reposition / Change" : "Upload Picture"}</span>
        </button>

        {currentAvatar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAvatarChange("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="p-1 rounded-md bg-slate-900 border border-slate-800 hover:border-red-400/50 text-slate-400 hover:text-red-400 transition"
            title="Reset to default avatar"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Crop & Reposition Modal */}
      {tempImageSrc && (
        <AvatarCropModal
          isOpen={isCropModalOpen}
          imageSrc={tempImageSrc}
          onClose={() => {
            setIsCropModalOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onCropComplete={(newAvatarUrl) => {
            onAvatarChange(newAvatarUrl);
            setIsCropModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfileAvatarUploader;
