import { RetroButton } from '@/components/ui/retro-ui';
import { useUsers } from '@/services';
import { motion } from 'framer-motion';
import { Plus, Shield } from 'lucide-react';
import { useState } from 'react';

export const UserSettingTab = () => {
        const [newAuthor, setNewAuthor] = useState('');
    const [role, setRole] = useState('Contributor');

        const {data: authors} = useUsers({pageIndex: 0, pageSize: 10});
        
        const handleAddAuthor = () => {
            if (newAuthor) {
                // addAuthor(newAuthor);
                setNewAuthor('');
                // triggerSave();
            }
        };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-2">User Directory</h2>
        <p className="text-stone-500 text-sm">
          Manage access levels and profiles for contributors.
        </p>
      </div>

      {/* Add New */}
      <div className="flex gap-4 mb-8 p-4 bg-stone-50 border border-stone-200 rounded items-end">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-stone-400">
            Username
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-os-accent font-mono text-sm"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        </div>
        <div className="w-48 flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-stone-400">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-os-accent text-sm h-[38px]"
          >
            <option>Contributor</option>
            <option>Editor</option>
            <option>Admin</option>
          </select>
        </div>
        <RetroButton onClick={handleAddAuthor} icon={<Plus size={16} />}>
          Create User
        </RetroButton>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3">
        {authors?.rows.map((author) => (
          <div
            key={author.id}
            className="flex items-center justify-between p-4 bg-white border-2 border-stone-100 hover:border-stone-300 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
                  alt="avatar"
                />
              </div>
              <div>
                <div className="font-bold text-stone-900">{author.fullName}</div>
                <div className="text-xs text-stone-500 flex items-center gap-1">
                  <Shield size={10} className="text-os-accent" />
                  Contributor
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-2 py-1 bg-stone-100 text-[10px] font-mono border border-stone-200 rounded">
                ID: {author.id}
              </div>
              {/* <button
                onClick={() => deleteAuthor(author)}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}