"use client";
import { page } from "../styles/styleclass";
import { useTheme } from "@/context/context";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Database, BookOpen, Heart } from "lucide-react";
function About() {
  const { dark, setDark } = useTheme();

  return (
    <div className={`${page(dark)} flex flex-col min-h-0 flex-1`}>
      {/* Back Navigation Bar */}
      <div
        className={`px-4 sm:px-6 py-4 flex items-center border-b ${
          dark ? "bg-gray-900 border-green-950" : "bg-white border-green-100"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
            dark
              ? "text-gray-400 hover:text-emerald-400"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          <ArrowLeft size={16} />
          Back to Chat
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header Introduction */}
          <div className="space-y-2">
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                dark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              About BioMate
            </h1>
            <p
              className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              An intelligent assistant engineered to help students navigate and
              master complex biological sciences.
            </p>
          </div>

          {/* Project Focus & Background Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${
              dark
                ? "bg-gray-900 border-gray-800 text-gray-100"
                : "bg-white border-green-100 text-gray-800"
            }`}
          >
            <h2 className="text-base font-bold flex items-center gap-2 mb-3">
              <Heart className="text-emerald-500 shrink-0" size={18} />
              The Mission
            </h2>
            <p
              className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              BioMate was created by <strong>Prabuddha Paranavithana</strong>{" "}
              purely for learning purposes and for fun. Built as a hands-on
              architectural study, this environment explores modern
              Retrieval-Augmented Generation (RAG) capabilities to provide
              accurate context extraction directly from formal educational
              resources.
            </p>
          </div>

          {/* Architecture Breakdown Section */}
          <div className="space-y-4">
            <h3
              className={`text-xs font-semibold uppercase tracking-wider ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Technical Stack Architecture
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {/* RAG Core */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  dark
                    ? "bg-gray-900/60 border-gray-800"
                    : "bg-white/60 border-green-100/70"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${dark ? "bg-gray-800 text-emerald-400" : "bg-green-100 text-emerald-600"}`}
                >
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${dark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    Knowledge Base Optimization
                  </h4>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Operating as a dedicated RAG system loaded exclusively with
                    the official **Advanced Level (A/L) Biology syllabus**,
                    ensuring domain-specific containment and zero reliance on
                    arbitrary general knowledge lookups.
                  </p>
                </div>
              </div>

              {/* Vectorization Engine */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  dark
                    ? "bg-gray-900/60 border-gray-800"
                    : "bg-white/60 border-green-100/70"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${dark ? "bg-gray-800 text-emerald-400" : "bg-green-100 text-emerald-600"}`}
                >
                  <Database size={18} />
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${dark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    Embedding Tokenization
                  </h4>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Syllabus document nodes are embedded using the{" "}
                    <code
                      className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${dark ? "bg-gray-800 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}
                    >
                      all-MiniLM-L6-v2
                    </code>{" "}
                    semantic mapping model, allowing fast structural similarity
                    indexing inside the local vector database.
                  </p>
                </div>
              </div>

              {/* Language Model */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  dark
                    ? "bg-gray-900/60 border-gray-800"
                    : "bg-white/60 border-green-100/70"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${dark ? "bg-gray-800 text-emerald-400" : "bg-green-100 text-emerald-600"}`}
                >
                  <Cpu size={18} />
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${dark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    Large Language Model Synthesis
                  </h4>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Injected reference metrics are generated into
                    conversational, syllabus-accurate answers utilizing the
                    high-efficiency{" "}
                    <strong className={dark ? "text-white" : "text-slate-900"}>
                      Gemini 2.0 Flash
                    </strong>{" "}
                    model.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="pt-6 text-center">
            <p
              className={`text-[11px] font-medium tracking-wide uppercase ${dark ? "text-gray-600" : "text-gray-400"}`}
            >
              BioMate Core Engineering &bull; Learning Project
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;
