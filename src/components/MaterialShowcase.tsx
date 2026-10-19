"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MaterialNode {
  id: string;
  title: string;
  type: string;
  image: string;
  specs: { label: string; value: string }[];
}

const MATERIAL_NODES: MaterialNode[] = [
  {
    id: "cotton",
    title: "COMBED COTTON WEAVE",
    type: "BASE TEXTILE",
    image: "/assets/editorial_detail_03.jpg",
    specs: [
      { label: "TEXTILE WEIGHT", value: "280 GSM" },
      { label: "YARN COUNT", value: "24S COMBED RING-SPUN" },
      { label: "STRUCTURE", value: "INTERLOCK JERSEY" },
      { label: "FINISH", value: "ENZYME MATTE PRE-SHRUNK" },
    ],
  },
  {
    id: "neck",
    title: "1X1 BOUND NECK RIBBING",
    type: "COLLAR ARCHITECTURE",
    image: "/assets/editorial_detail_03.jpg",
    specs: [
      { label: "RIB SPEC", value: "1X1 HIGH-TENSILE SPAN RIB" },
      { label: "WIDTH", value: "28MM BINDING" },
      { label: "COLLAR STRETCH", value: "REINFORCED RETENTION" },
      { label: "STITCHING", value: "INTERNAL BOUND SEAM" },
    ],
  },
  {
    id: "shoulder",
    title: "SHOULDER SEAM REINFORCEMENT",
    type: "STRUCTURAL SEAM",
    image: "/assets/editorial_detail_03.jpg",
    specs: [
      { label: "CONSTRUCTION", value: "TWIN-NEEDLE CHAIN STITCH" },
      { label: "TAPE INLAY", value: "COTTON TWILL STABILIZER" },
      { label: "SILHOUETTE", value: "DROPPED 45MM PAST ACROMION" },
    ],
  },
  {
    id: "sleeve",
    title: "SLEEVE HEMMING",
    type: "CUFF FINISH",
    image: "/assets/editorial_detail_03.jpg",
    specs: [
      { label: "HEM DEPTH", value: "30MM FOLDED" },
      { label: "STITCH PITCH", value: "10-12 STITCHES PER INCH" },
      { label: "OPENING", value: "WIDE ELBOW-LENGTH DRAPE" },
    ],
  },
  {
    id: "bottom-hem",
    title: "BOTTOM HEM CONSTRUCTION",
    type: "LOWER APERTURE",
    image: "/assets/editorial_hem_04.jpg",
    specs: [
      { label: "STITCH METHOD", value: "DUAL NEEDLE COVERSTITCH" },
      { label: "HEM WIDTH", value: "32MM CLEAN TURN" },
      { label: "DRAPE PROFILE", value: "STRAIGHT UNWEIGHTED HANG" },
    ],
  },
  {
    id: "fbf-logo",
    title: "PRINTED FBF NECK MONOGRAM",
    type: "IN-COLLAR IDENTITY",
    image: "/assets/editorial_neck_05.jpg",
    specs: [
      { label: "INK FORMULATION", value: "HIGH-OPACITY WATER-BASED MATTE" },
      { label: "HAND FEEL", value: "ZERO HAND-FEEL DISCHARGE" },
      { label: "SCALE", value: "48MM X 18MM" },
      { label: "PLACEMENT", value: "20MM BELOW REAR RIB" },
    ],
  },
  {
    id: "signature",
    title: "BOTTOM-CORNER PERSONALIZATION",
    type: "HEM IDENTITY",
    image: "/assets/editorial_hem_04.jpg",
    specs: [
      { label: "LAYER 1", value: "fbfy by (UPPER TIER)" },
      { label: "LAYER 2", value: "CLIENT SPECIMEN ({NAME})" },
      { label: "POSITION", value: "RIGHT LOWER CORNER HEM" },
      { label: "ELEVATION", value: "35MM FROM BASELINE" },
    ],
  },
];

export function MaterialShowcase() {
  const [selectedNode, setSelectedNode] = useState<MaterialNode>(MATERIAL_NODES[0]);

  return (
    <section className="relative w-full py-28 md:py-36 bg-[#08080a] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 pb-6 border-b border-white/10">
          <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase block mb-3">
            TACTILE ENGINEERING
          </span>
          <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight">
            FABRIC & CONSTRUCTION
          </h2>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Interactive Material Selection List */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="font-mono-clean text-[10px] tracking-[0.25em] text-[#6E6E73] uppercase mb-2">
              INSPECTION NODES (07)
            </span>

            {MATERIAL_NODES.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#141418] border-white text-white"
                      : "bg-[#0c0c0e] border-white/5 text-[#8E8E93] hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-clean text-[11px] text-[#6E6E73]">
                      0{index + 1}
                    </span>
                    <div>
                      <div className="font-brand text-sm tracking-wide font-bold">
                        {node.title}
                      </div>
                      <div className="font-mono-clean text-[10px] text-[#6E6E73] tracking-widest uppercase">
                        {node.type}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Macro View & Verified Properties */}
          <div className="lg:col-span-7 bg-[#0c0c0e] border border-white/10 p-6 md:p-8">
            {/* Macro Image Viewport */}
            <div className="relative w-full aspect-[16/10] bg-[#111115] border border-white/5 overflow-hidden mb-8">
              <Image
                src={selectedNode.image}
                alt={selectedNode.title}
                fill
                className="object-cover object-center transition-all duration-700"
              />

              <div className="absolute top-3 left-3 font-mono-clean text-[10px] text-white/70 bg-black/60 px-2 py-1 backdrop-blur-sm">
                MACRO SCAN // {selectedNode.id.toUpperCase()}
              </div>
            </div>

            {/* Technical Node Specifications Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-brand text-xl text-white font-bold">
                  {selectedNode.title}
                </h3>
                <span className="font-mono-clean text-xs text-[#8E8E93]">
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-3 font-mono-clean text-xs border-t border-white/10 pt-4">
                {selectedNode.specs.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-1 border-b border-white/5"
                  >
                    <span className="text-[#6E6E73]">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
