import { RetroButton } from "@/components/ui/retro-ui";
import { Serie } from "@/features/apps/blog/data";
import {
  SerieDto,
  useCreateSerie,
  useDeleteSerie,
  useSerie,
  useSeries,
} from "@/services";
import { motion } from "framer-motion";
import { ImageIcon, Layers, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const SeriesSettingTab = () => {
  const [serieTitle, setSerieTitle] = useState("");
  const [serieDesc, setSerieDesc] = useState("");
  const [serieCover, setSerieCover] = useState("");

  const { mutateAsync: addSerieAction } = useCreateSerie();
  const { mutateAsync: deleteSerieAction } = useDeleteSerie();
  const { data: series } = useSeries({ pageIndex: 0, pageSize: 10 });

  const handleAddSeries = () => {
    if (!serieTitle || !serieDesc) return;

    const newSerie: SerieDto = {
      slug: serieTitle.toLowerCase().replace(/\s+/g, "-"),
      name: serieTitle,
      description: serieDesc,
      coverUrl:
        serieCover ||
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop",
    };

    addSerieAction(newSerie);
    setSerieTitle("");
    setSerieDesc("");
    setSerieCover("");
    // triggerSave();
  };

  const deleteSeries = async (id: number) => {
    await deleteSerieAction(id);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-2">Series Management</h2>
        <p className="text-stone-500 text-sm">
          Curate collections of posts into episodic content.
        </p>
      </div>

      {/* Add New Series */}
      <div className="bg-stone-50 border border-stone-200 rounded p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Layers size={100} />
        </div>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-stone-400">
              Series Title
            </label>
            <input
              type="text"
              placeholder="e.g. The Startup Chronicles"
              className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] font-bold text-stone-900"
              value={serieTitle}
              onChange={(e) => setSerieTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-stone-400">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief summary of this collection..."
              className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] text-sm"
              value={serieDesc}
              onChange={(e) => setSerieDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-stone-400">
                Cover Image URL
              </label>
              <div className="flex items-center gap-2 bg-white border border-stone-300 px-3 py-2 focus-within:border-[#ff7e33]">
                <ImageIcon size={14} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full outline-none text-xs text-stone-600 bg-transparent"
                  value={serieCover}
                  onChange={(e) => setSerieCover(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <RetroButton onClick={handleAddSeries} icon={<Plus size={16} />}>
                Create Series
              </RetroButton>
            </div>
          </div>
        </div>
      </div>

      {/* Series List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {series?.rows.map((serie) => (
          <div
            key={serie.id}
            className="flex flex-col border-2 border-stone-200 bg-white rounded overflow-hidden hover:border-[#ff7e33] transition-colors group"
          >
            <div className="h-24 bg-stone-100 relative overflow-hidden">
              <img
                src={serie.coverUrl}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                alt="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <h3 className="text-white font-bold text-sm leading-tight shadow-black drop-shadow-md">
                  {serie.name}
                </h3>
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                {serie.description}
              </p>
              <div className="mt-auto flex justify-between items-center border-t border-stone-100 pt-2">
                <span className="text-[10px] font-mono text-stone-400">
                  ID: {serie.id}
                </span>
                <button
                  onClick={() => deleteSeries(serie.id)}
                  className="text-stone-400 hover:text-red-500 transition-colors"
                  title="Delete Series"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SeriesSettingTab;
