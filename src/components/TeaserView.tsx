import { useState } from 'react';
import { Sparkles, MessageCircle, FileDown, Link as LinkIcon, Download } from 'lucide-react';

export function TeaserView() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerTeaser = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="p-6 h-full flex flex-col pt-8">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="text-zinc-800 dark:text-zinc-200" size={24} />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Pro Features</h2>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
        Future updates powered by AWS Amplify will bring collaboration and export features to AirList.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => triggerTeaser('Coming Soon: Send link to WhatsApp')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Share to WhatsApp</h3>
              <p className="text-xs text-zinc-500">Send your list directly to chats</p>
            </div>
          </div>
          <LinkIcon size={18} className="text-zinc-300 dark:text-zinc-600" />
        </button>

        <button
          type="button"
          onClick={() => triggerTeaser('Coming Soon: Generate PDF Document')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <FileDown size={20} className="text-zinc-700 dark:text-zinc-300" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Export as PDF</h3>
              <p className="text-xs text-zinc-500">Download a clean printable list</p>
            </div>
          </div>
          <Download size={18} className="text-zinc-300 dark:text-zinc-600" />
        </button>
      </div>

      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg shadow-xl font-medium animate-in fade-in slide-in-from-top-4 z-50 whitespace-nowrap text-xs">
          {toastMsg}
        </div>
      )}
    </div>
  );
}