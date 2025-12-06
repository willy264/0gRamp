import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { of as ipfsOnlyHashOf } from "ipfs-only-hash";
import { submitKyc } from "../lib/api";
import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function KYCModal({ open, onClose }: Props) {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedCid, setSubmittedCid] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canSubmit = useMemo(
    () => !!address && !!cid && !submitting,
    [address, cid, submitting]
  );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSubmittedCid("");
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const buf = new Uint8Array(await f.arrayBuffer());
      try {
        const computed = await ipfsOnlyHashOf(buf, {
          cidVersion: 1,
          rawLeaves: true,
        });
        setCid(computed);
      } catch (e: any) {
        console.error(e);
        setError("Failed to compute CID");
      }
    } else {
      setCid("");
    }
  };

  const onSubmit = async () => {
    if (!address || !cid || !file) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await submitKyc({
        walletAddress: address,
        cid,
        mime: file.type,
        size: file.size,
      });
      setSubmittedCid(res.cid);
    } catch (e: any) {
      setError(e?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-black/90 backdrop-blur-xl border border-accent/20 p-6 overflow-hidden"
            style={{
              boxShadow: "0 0 40px rgba(255, 79, 216, 0.1)",
            }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "linear-gradient(45deg, transparent 0%, rgba(255, 79, 216, 0.05) 50%, transparent 100%)",
                  "linear-gradient(45deg, transparent 0%, rgba(255, 79, 216, 0.1) 50%, transparent 100%)",
                  "linear-gradient(45deg, transparent 0%, rgba(255, 79, 216, 0.05) 50%, transparent 100%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-xl bg-accent/20 text-accent"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon icon="mdi:account-check" className="text-2xl" />
                </motion.div>
                <h3 className="text-xl font-semibold bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                  KYC Verification
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
              >
                <Icon icon="mdi:close" />
              </motion.button>
            </div>

            <p className="text-gray-400 mb-6 relative z-10">
              Upload a government ID or proof of address. We compute a local CID
              and store only the content address (no raw file) for verification.
            </p>

            <motion.div
              className="space-y-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <label
                  htmlFor="kyc-file"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Upload Document
                </label>
                <input
                  id="kyc-file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={onFileChange}
                  aria-label="Upload verification document"
                  aria-describedby="file-description"
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2.5 file:px-4 
                    file:rounded-xl file:border file:border-accent/30
                    file:text-sm file:font-medium
                    file:bg-black/40 file:backdrop-blur-xl file:text-accent 
                    hover:file:bg-accent/20 hover:file:border-accent/50
                    file:transition-all file:duration-300
                    focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                <p id="file-description" className="mt-1 text-xs text-gray-500">
                  Accepted formats: Images (PNG, JPG, etc.) and PDF documents
                </p>
              </div>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-accent/10 border border-accent/30"
                >
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:file-document" className="text-accent" />
                      <span className="font-medium text-white">
                        {file.name}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-400">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </motion.div>
              )}

              {cid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-purple-600/10 border border-purple-400/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon="mdi:link-variant" className="text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">
                      Content ID (CID)
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 break-all font-mono">
                    {cid}
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-accent/30 hover:border-accent/50 text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    canSubmit
                      ? "bg-linear-to-r from-accent to-purple-600 text-white hover:shadow-xl hover:shadow-accent/20"
                      : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                  )}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Icon icon="mdi:loading" className="text-base" />
                      </motion.div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:check-circle" className="text-base" />
                      <span>Submit</span>
                    </div>
                  )}
                </motion.button>
              </div>

              {submittedCid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon="mdi:check-circle" className="text-green-400" />
                    <span className="text-sm font-medium text-green-300">
                      Verification Successful
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 break-all font-mono">
                    Stored CID: {submittedCid}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
