import { RetroButton } from '@/components/ui/retro-ui'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/services'
import { motion } from 'framer-motion'
import { Plus, Tag, Trash2 } from 'lucide-react'
import {useState} from 'react'

const CategoriesSettingTab = () => {
    const [newCat, setNewCat] = useState('');
    const {data: categories} = useCategories({pageIndex: 0, pageSize: 10});
    
    const {mutateAsync: createCategoryAction} = useCreateCategory();
    const {mutateAsync: deleteCategoryAction} = useDeleteCategory();
    
    const handleAddCategory = async () => {
        if (newCat && !categories?.rows.includes(newCat)) {
            await createCategoryAction({name: newCat});
            setNewCat('');
            // triggerSave();
        }
    };
    const deleteCategory =  async (id: number) => {
        await deleteCategoryAction(id);
    }
  return (
     <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-black mb-2">Taxonomy Management</h2>
            <p className="text-stone-500 text-sm">
              Organize scrolls into logical groupings for better retrieval.
            </p>
          </div>

          {/* Add New */}
          <div className="flex gap-4 mb-8 p-4 bg-stone-50 border border-stone-200 rounded">
            <input
              type="text"
              placeholder="New Category Name..."
              className="flex-1 bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] font-mono text-sm"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <RetroButton onClick={handleAddCategory} icon={<Plus size={16} />}>
              Add Category
            </RetroButton>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 gap-3">
            {categories?.rows.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 bg-white border-2 border-stone-100 hover:border-stone-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center text-stone-400">
                    <Tag size={16} />
                  </div>
                  <span className="font-bold text-stone-700">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-stone-400 font-mono">
                    0 scrolls
                  </span>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
  )
}

export default CategoriesSettingTab