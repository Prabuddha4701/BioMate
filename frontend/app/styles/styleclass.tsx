export const page = (dark: boolean) =>
  dark
    ? "flex flex-col bg-gray-950 transition-colors duration-300"
    : "flex flex-col bg-green-50 transition-colors duration-300";

export const Header = (dark: boolean) =>
  dark
    ? "flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-gray-900 border-b border-green-950 shadow-lg flex-shrink-0"
    : "flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-white   border-b border-green-100 shadow-sm  flex-shrink-0";

export const logoTitle = (dark: boolean) =>
  dark
    ? "text-emerald-400 font-extrabold text-lg leading-tight"
    : "text-emerald-600 font-extrabold text-lg leading-tight";

export const logoSub = (dark: boolean) =>
  dark ? "text-gray-500 text-xs" : "text-gray-400 text-xs";

export const toggleBtn = (dark: boolean) =>
  dark
    ? "w-9 sm:w-9 h-9 rounded-xl bg-gray-800  border border-gray-700  text-yellow-400 flex items-center justify-center cursor-pointer hover:bg-gray-700 shadow-sm transition-all"
    : "w-9 sm:w-9 h-9 rounded-xl bg-green-100 border border-green-200 text-gray-600   flex items-center justify-center cursor-pointer hover:bg-green-200 shadow-sm transition-all";

export const navBtn = (dark: boolean) =>
  dark
    ? "px-3 sm:px-4 py-2 rounded-xl bg-gray-800/80 sm:bg-transparent border border-gray-700 text-gray-200 text-xs sm:text-sm font-semibold sm:font-medium cursor-pointer hover:bg-gray-800 hover:border-emerald-700 shadow-sm sm:shadow-none transition-all"
    : "px-3 sm:px-4 py-2 rounded-xl bg-white/90 sm:bg-transparent border border-green-200 sm:border-gray-200 text-gray-700 sm:text-gray-600 text-xs sm:text-sm font-semibold sm:font-medium cursor-pointer hover:bg-green-50 hover:border-emerald-400 shadow-sm sm:shadow-none transition-all";

export const chatArea = (dark: boolean) =>
  dark
    ? "flex-1 min-h-[55vh] md:min-h-0 flex flex-col overflow-hidden bg-gray-950"
    : "flex-1 min-h-[55vh] md:min-h-0 flex flex-col overflow-hidden bg-green-50";

export const inputBar = (dark: boolean) =>
  dark
    ? "px-4 sm:px-6 py-3 sm:py-4 border-t border-green-950 bg-gray-900 flex-shrink-0"
    : "px-4 sm:px-6 py-3 sm:py-4 border-t border-green-100 bg-white     flex-shrink-0";

export const inputEl = (dark: boolean) =>
  dark
    ? "min-w-0 flex-1 px-4 py-3 rounded-xl border border-gray-700  bg-gray-800  text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-emerald-600 transition-colors"
    : "min-w-0 flex-1 px-4 py-3 rounded-xl border border-green-200 bg-white      text-gray-800 placeholder-gray-400 text-sm outline-none focus:border-emerald-400 transition-colors";

export const sendBtn = (dark: boolean) =>
  dark
    ? "w-11 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white flex items-center justify-center flex-shrink-0 cursor-pointer border-none shadow-lg transition-all active:scale-95"
    : "w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 cursor-pointer border-none shadow-md transition-all active:scale-95";

export const botBubble = (dark: boolean) =>
  "max-w-[85%] sm:max-w-xl break-words px-4 py-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl text-sm leading-relaxed " +
  (dark
    ? "bg-gray-800  border border-gray-700  text-gray-100 shadow-md"
    : "bg-white     border border-green-100 text-gray-800 shadow-sm");

export const userBubble = (dark: boolean) =>
  "max-w-[85%] sm:max-w-xl break-words px-4 py-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl text-sm leading-relaxed " +
  (dark
    ? "bg-emerald-800 text-white shadow-md"
    : "bg-emerald-500 text-white shadow-sm");

export const emptyText = (dark: boolean) =>
  dark ? "text-gray-500" : "text-gray-400";
export const emptySubText = (dark: boolean) =>
  dark ? "text-gray-600" : "text-gray-300";

export const messageText = (dark: boolean) =>
  `
  font-[var(--font-inter)]
  text-[15px] leading-[1.7] tracking-[-0.01em]
  text-left
  [&_p]:my-2 [&_p]:font-medium
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1
  [&_li]:font-medium
  [&_li]:marker:text-emerald-500
  [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1.5
  [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5
  [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1
  [&_code]:font-mono [&_code]:text-xs [&_code]:bg-emerald-50 [&_code]:text-emerald-700 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
  [&_a]:text-emerald-600 [&_a]:font-semibold [&_a]:underline
`
    .replace(/\s+/g, " ")
    .trim();

// [&_strong]:font-bold ${dark ? "[&_strong]:text-white" : "[&_strong]:text-slate-900"}
// ${dark ? "text-slate-100" : "text-slate-800"}
