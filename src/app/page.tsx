"use client";

import { useState } from "react";
import Image from "next/image";
import { SupportedFontFormat } from "./types/font";

const SUPPORTED_FORMATS: SupportedFontFormat[] = [".otf", ".ttf"];

export default function Home() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // Almacenamos el objeto File real
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      SUPPORTED_FORMATS.some((format) =>
        droppedFile.name.toLowerCase().endsWith(format)
      )
    ) {
      setFile(droppedFile);
    }
  };

  const handleProcessFont = async (): Promise<void> => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      // La key debe ser "fontFile" para coincidir con lo que espera el backend
      formData.append("fontFile", file, file.name);

      // Se envía la fuente al endpoint /upload
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error processing font");
      }

      // Recibimos la respuesta en JSON, que contiene el filename procesado
      const data = await res.json();
      console.log("Font processed:", data);

      // Para la descarga, puedes redirigir al endpoint /download/<filename>
      // Por ejemplo, abriendo la URL en una nueva pestaña:
      const downloadUrl = `http://localhost:5000/download/${data.filename}`;
      window.open(downloadUrl, "_blank");
    } catch (err: any) {
      setError(err.message || "An error occurred processing the font.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 md:p-24">
      <nav className="flex justify-between items-center">
        {/* GIF más grande */}
        <div className="w-5/6">
          <Image
            rel="preload"
            src="/notwithmytype2.gif"
            alt="Notwithmytype"
            style={{ objectFit: "fill", width: "80%", height: "300px" }}
            width={900}
            height={100}
            priority
            unoptimized
          />
        </div>
        <button
          className="text-lg hover:underline font-bold"
          onClick={() =>
            (window.location.href = "mailto:contact@notwithmytype.com")
          }
        >
          CONTACT US
        </button>
      </nav>

      <section>
        <h2 className="text-2xl font-bold mb-2">Join us for a better word.</h2>
        <p className="text-xl mb-1">
          Relaunch your typographies with a non-negotiable change:
        </p>
        <p className="text-xl italic mb-12">the N-word blocked.</p>

        <div
          className={`relative rounded-[2rem] bg-black text-white p-8 h-[300px] transition-all
            ${isDragging ? "border-4 border-dashed border-gray-400" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 rounded-[2rem] flex p-5">
            {file ? (
              <p className="text-lg">{file.name}</p>
            ) : (
              <p className="text-lg flex gap-2">DROP YOUR FONT FILE HERE</p>
            )}
          </div>
          <p className="absolute bottom-6 right-8 text-gray-400 italic">
            Supported formats: {SUPPORTED_FORMATS.join(" ")}
          </p>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="flex justify-end mt-6">
          <button
            className={`bg-black text-white px-8 py-3 rounded-full text-lg
              ${
                !file || isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            disabled={!file || isProcessing}
            onClick={handleProcessFont}
          >
            {isProcessing ? "PROCESSING..." : "PROCESS FONT"}
          </button>
        </div>
      </section>
    </main>
  );
}
