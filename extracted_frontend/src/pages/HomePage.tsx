import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Download, Music, Trash2, Clock, ExternalLink, Copy } from "lucide-react";
import { SiYoutube } from "react-icons/si";
import { toast } from "sonner";
import {
  useFetchMediaInfo,
  useStartDownload,
  useGetDownloadStatus,
  useGetDownloadHistory,
  useClearDownloadHistory,
  useDeleteHistoryItem,
  getGetDownloadStatusQueryKey,
  getGetDownloadHistoryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import GlowOrbs from "@/components/GlowOrbs";

type Platform = "youtube" | "unknown";

interface QualityOption {
  label: string;
  format: string;
  formatId: string | null;
  filesize: number | null;
  isAudio: boolean;
}

interface MediaInfo {
  url: string;
  platform: Platform;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  viewCount: number | null;
  qualities: QualityOption[];
}

function detectPlatform(url: string): Platform {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  return "unknown";
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function formatViews(n: number | null): string {
  if (!n) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function DownloadCard({ info, onReset }: { info: MediaInfo; onReset: () => void }) {
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>(
    info.qualities[0] ?? { label: "MP3", format: "mp3", formatId: null, filesize: null, isAudio: true }
  );
  const [jobId, setJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const startDownload = useStartDownload();

  const { data: jobStatus } = useGetDownloadStatus(jobId ?? "", {
    query: {
      enabled: !!jobId,
      queryKey: getGetDownloadStatusQueryKey(jobId ?? ""),
      refetchInterval: (q) => {
        const status = q.state.data?.status;
        if (status === "complete" || status === "error") return false;
        return 1500;
      },
    },
  });

  useEffect(() => {
    if (jobStatus?.status === "complete") {
      toast.success("Download complete! Click Save File to download.");
      queryClient.invalidateQueries({ queryKey: getGetDownloadHistoryQueryKey() });
    }
    if (jobStatus?.status === "error") {
      toast.error(jobStatus.error ?? "Download failed");
    }
  }, [jobStatus?.status]);

  const handleDownload = () => {
    startDownload.mutate(
      {
        data: {
          url: info.url,
          formatId: selectedQuality.formatId ?? selectedQuality.label.toLowerCase(),
          label: selectedQuality.label,
          title: info.title,
          thumbnail: info.thumbnail ?? undefined,
          platform: info.platform,
        },
      },
      {
        onSuccess: (job) => {
          setJobId(job.jobId);
          toast.info("Download started...");
        },
        onError: () => toast.error("Failed to start download"),
      }
    );
  };

  const progress = jobStatus?.progress ?? 0;
  const status = jobStatus?.status ?? "idle";
  const isDownloading = status === "downloading" || status === "pending";
  const isComplete = status === "complete";
  const isError = status === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl overflow-hidden mt-8"
      style={{ border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 0 40px rgba(59,130,246,0.08)" }}
    >
      <div className="flex flex-col md:flex-row gap-0">
        {/* Thumbnail */}
        {info.thumbnail && (
          <div className="md:w-64 flex-shrink-0 relative overflow-hidden">
            <img
              src={info.thumbnail}
              alt={info.title}
              className="w-full h-48 md:h-full object-cover"
              data-testid="img-media-thumbnail"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
            {/* Platform badge */}
            <div className="absolute top-3 left-3">
              <div className="glass-panel px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium">
                <SiYoutube size={12} className="text-red-500" />
                <span className="text-slate-300">YouTube</span>
              </div>
            </div>
            {info.duration && (
              <div className="absolute bottom-3 right-3 glass-panel px-2 py-1 rounded-md text-xs text-slate-300 font-mono">
                {formatDuration(info.duration)}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 leading-snug line-clamp-2" data-testid="text-media-title">
                {info.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                {info.uploader && <span data-testid="text-uploader">{info.uploader}</span>}
                {info.viewCount && <span>{formatViews(info.viewCount)}</span>}
              </div>
            </div>
            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-500 hover:text-slate-300"
              data-testid="button-reset"
            >
              ✕
            </motion.button>
          </div>

          {/* Quality selector */}
          <div className="mt-5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Quality</p>
            <div className="flex flex-wrap gap-2" data-testid="quality-selector">
              {info.qualities.map((q) => (
                <motion.button
                  key={q.label}
                  onClick={() => setSelectedQuality(q)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  data-testid={`button-quality-${q.label.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedQuality.label === q.label
                      ? "bg-blue-500/20 border border-blue-500/60 text-blue-300"
                      : "glass-panel border border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  {q.isAudio ? <span className="flex items-center gap-1"><Music size={10} />{q.label}</span> : q.label}
                  {q.filesize && <span className="ml-1 text-xs opacity-60">{formatBytes(q.filesize)}</span>}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Download button & progress */}
          <div className="mt-5">
            {!isComplete && !isError && (
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading || startDownload.isPending}
                whileHover={!isDownloading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isDownloading ? { scale: 0.98 } : {}}
                data-testid="button-download"
                className="relative w-full py-3 px-6 rounded-xl font-semibold text-white overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: isDownloading
                    ? "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5))"
                    : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: isDownloading ? "none" : "0 0 30px rgba(59,130,246,0.35)",
                }}
              >
                {isDownloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Downloading... {progress > 0 ? `${Math.round(progress)}%` : ""}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download {selectedQuality.label}
                  </span>
                )}
              </motion.button>
            )}

            {/* Progress bar */}
            {isDownloading && (
              <div className="mt-3">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {isComplete && jobStatus?.downloadUrl && (
              <motion.a
                href={jobStatus.downloadUrl}
                download={jobStatus.filename ?? undefined}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                data-testid="link-save-file"
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: "0 0 30px rgba(16,185,129,0.35)",
                }}
              >
                <Download size={16} />
                Save File
              </motion.a>
            )}

            {isError && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm" data-testid="text-error">
                {jobStatus?.error ?? "Download failed"}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HistorySection() {
  const { data: history, isLoading } = useGetDownloadHistory();
  const clearHistory = useClearDownloadHistory();
  const deleteItem = useDeleteHistoryItem();
  const queryClient = useQueryClient();

  if (isLoading) return null;
  if (!history || history.length === 0) return null;

  const handleClear = () => {
    clearHistory.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDownloadHistoryQueryKey() });
        toast.success("History cleared");
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetDownloadHistoryQueryKey() }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-16"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-200">Download History</h2>
          <span className="text-xs text-slate-500 glass-panel px-2 py-0.5 rounded-full">{history.length}</span>
        </div>
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
          data-testid="button-clear-history"
        >
          <Trash2 size={12} />
          Clear all
        </motion.button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {history.slice(0, 10).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 group transition-colors"
            data-testid={`row-history-${item.id}`}
          >
            {item.thumbnail ? (
              <img src={item.thumbnail} alt="" className="w-12 h-9 rounded-lg object-cover flex-shrink-0 opacity-80" />
            ) : (
              <div className="w-12 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <SiYoutube size={14} className="text-red-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-300 truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <SiYoutube size={10} className="text-red-500" />
                <span className="text-xs text-slate-500">YouTube</span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs glass-panel px-1.5 py-0.5 rounded text-blue-400/80">{item.label}</span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-7 h-7 rounded-lg glass-panel flex items-center justify-center text-slate-500 hover:text-blue-400"
                data-testid={`link-history-url-${item.id}`}
              >
                <ExternalLink size={12} />
              </motion.a>
              <motion.button
                onClick={() => handleDelete(item.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-lg glass-panel flex items-center justify-center text-slate-500 hover:text-red-400"
                data-testid={`button-delete-history-${item.id}`}
              >
                <Trash2 size={12} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchInfo = useFetchMediaInfo();

  const detectedPlatform = url ? detectPlatform(url) : null;
  const isYouTube = detectedPlatform === "youtube";

  const handleAnalyse = useCallback(() => {
    if (!url.trim()) return;
    fetchInfo.mutate(
      { data: { url: url.trim() } },
      {
        onSuccess: (data) => setMediaInfo(data as MediaInfo),
        onError: (err: unknown) => {
          const msg =
            err &&
            typeof err === "object" &&
            "data" in err &&
            err.data &&
            typeof err.data === "object" &&
            "error" in err.data
              ? String((err.data as { error: string }).error)
              : "Could not fetch media info";
          toast.error(msg);
        },
      }
    );
  }, [url]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.startsWith("http")) {
      setTimeout(() => {
        const inputEl = inputRef.current;
        if (inputEl) {
          const val = inputEl.value;
          if (val && val.startsWith("http")) {
            setUrl(val);
          }
        }
      }, 50);
    }
  }, []);

  const handleCopyLink = () => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied!"));
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const childVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const supportedFormats = [
    { name: "YouTube Videos", icon: <SiYoutube className="text-red-500" size={20} /> },
    { name: "YouTube Shorts", icon: <SiYoutube className="text-red-400" size={20} /> },
    { name: "MP3 Audio", icon: <Music className="text-blue-400" size={20} /> },
    { name: "1080p HD", icon: <SiYoutube className="text-violet-400" size={20} /> },
  ];

  return (
    <div className="relative">
      <GlowOrbs />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={childVariants} className="flex justify-center mb-8">
            <div className="glass-panel px-4 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2 text-xs text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Free · No Registration · No Limits
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={childVariants} className="text-center mb-6">
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="text-gradient">Download</span>
              <br />
              <span className="text-slate-100">Any Video.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Paste any YouTube link to instantly download videos, Shorts, and audio — in any quality.
            </p>
          </motion.div>

          {/* URL Input */}
          <motion.div variants={childVariants} className="mt-8">
            <div
              className="neon-border rounded-2xl overflow-hidden transition-all"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Platform icon */}
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isYouTube ? (
                      <motion.div key="yt" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <SiYoutube size={20} className="text-red-500" />
                      </motion.div>
                    ) : (
                      <motion.div key="link" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Link2 size={18} className="text-slate-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyse()}
                  placeholder="Paste YouTube URL here..."
                  className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-base outline-none"
                  data-testid="input-url"
                />

                {url && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={handleCopyLink}
                    className="flex-shrink-0 w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-500 hover:text-slate-300"
                    data-testid="button-copy-url"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy size={13} />
                  </motion.button>
                )}
              </div>

              <div className="px-2 pb-2">
                <motion.button
                  onClick={handleAnalyse}
                  disabled={!url || fetchInfo.isPending}
                  whileHover={url && !fetchInfo.isPending ? { scale: 1.01 } : {}}
                  whileTap={url && !fetchInfo.isPending ? { scale: 0.99 } : {}}
                  data-testid="button-analyse"
                  className="w-full py-3 px-6 rounded-xl font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: !url || fetchInfo.isPending
                      ? "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4))"
                      : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    boxShadow: url && !fetchInfo.isPending ? "0 0 30px rgba(59,130,246,0.25)" : "none",
                  }}
                >
                  {fetchInfo.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                      />
                      Fetching info...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <SiYoutube size={16} />
                      Analyse
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Media card */}
          <AnimatePresence>
            {mediaInfo && (
              <DownloadCard
                key={mediaInfo.url}
                info={mediaInfo}
                onReset={() => { setMediaInfo(null); setUrl(""); }}
              />
            )}
          </AnimatePresence>

          {/* Supported formats */}
          {!mediaInfo && (
            <motion.div variants={childVariants} className="mt-14">
              <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-5 font-medium">
                Supported
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {supportedFormats.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="glass-panel rounded-xl p-4 flex flex-col items-center gap-2 text-center"
                    style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {p.icon}
                    <span className="text-xs text-slate-400 font-medium">{p.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* History */}
          <HistorySection />
        </motion.div>
      </div>
    </div>
  );
}
