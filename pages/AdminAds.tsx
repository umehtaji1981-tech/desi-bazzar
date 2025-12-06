
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Megaphone, Edit2, GripVertical, AlertCircle, Save, Image as ImageIcon } from 'lucide-react';
import { SponsorAd } from '../types';

const AdminAds: React.FC = () => {
  const { ads, addAd, deleteAd, updateAd, reorderAds } = useStore();
  
  const [formData, setFormData] = useState<Omit<SponsorAd, 'id'>>({
      title: '',
      imageUrl: '',
      link: '',
      placement: 'hero'
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedAdId, setDraggedAdId] = useState<string | null>(null);

  const validate = () => {
    if (formData.placement === 'hero' && !formData.imageUrl) {
        setError('Hero ads must have an image.');
        return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!validate()) return;

      if (editingId) {
          updateAd(editingId, formData);
          setEditingId(null);
      } else {
          addAd(formData);
      }
      
      setFormData({ title: '', imageUrl: '', link: '', placement: 'hero' });
  };

  const handleEdit = (ad: SponsorAd) => {
      setFormData({
          title: ad.title,
          imageUrl: ad.imageUrl,
          link: ad.link,
          placement: ad.placement
      });
      setEditingId(ad.id);
      setError(null);
      // Scroll to top to see form
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
      setFormData({ title: '', imageUrl: '', link: '', placement: 'hero' });
      setEditingId(null);
      setError(null);
  };

  const confirmDelete = () => {
      if (deleteConfirmationId) {
          deleteAd(deleteConfirmationId);
          setDeleteConfirmationId(null);
      }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedAdId(id);
      e.dataTransfer.effectAllowed = 'move';
      // Set data for Firefox support
      e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string, placement: 'hero' | 'header') => {
      e.preventDefault();
      if (!draggedAdId || draggedAdId === targetId) return;

      const placementAds = ads.filter(a => a.placement === placement);
      const otherAds = ads.filter(a => a.placement !== placement);

      const sourceIndex = placementAds.findIndex(a => a.id === draggedAdId);
      const targetIndex = placementAds.findIndex(a => a.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      const newPlacementAds = [...placementAds];
      const [movedAd] = newPlacementAds.splice(sourceIndex, 1);
      newPlacementAds.splice(targetIndex, 0, movedAd);

      // Reconstruct full list. 
      reorderAds([...newPlacementAds, ...otherAds]);
      setDraggedAdId(null);
  };

  const renderAdList = (placement: 'hero' | 'header') => {
      const filteredAds = ads.filter(a => a.placement === placement);

      if (filteredAds.length === 0) {
          return <p className="text-gray-400 text-sm italic p-4">No ads configured for this section.</p>;
      }

      return (
          <div className="space-y-3">
              {filteredAds.map((ad) => (
                  <div 
                      key={ad.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, ad.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, ad.id, placement)}
                      className={`flex gap-4 items-center border border-gray-100 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors ${draggedAdId === ad.id ? 'opacity-50 border-dashed border-orange-300' : ''}`}
                  >
                      <div className="cursor-move text-gray-400 hover:text-gray-600 p-1">
                          <GripVertical size={20} />
                      </div>
                      
                      {placement === 'hero' ? (
                          <div className="w-24 h-16 rounded bg-gray-100 border overflow-hidden flex-shrink-0">
                               {ad.imageUrl ? (
                                   <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                               ) : (
                                   <div className="w-full h-full flex items-center justify-center text-gray-400">
                                       <ImageIcon size={20} />
                                   </div>
                               )}
                          </div>
                      ) : (
                           <div className="w-10 h-10 rounded bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                               <Megaphone size={20} />
                           </div>
                      )}

                      <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-800 truncate">{ad.title}</div>
                          <div className="text-xs text-gray-500 truncate">{ad.link}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleEdit(ad)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                            title="Edit Ad"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => setDeleteConfirmationId(ad.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            title="Delete Ad"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="space-y-6 relative">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Megaphone className="text-orange-600" /> Manage Sponsored Ads
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Ad Form */}
          <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      {editingId ? <><Edit2 size={20} className="text-blue-600"/> Edit Advertisement</> : <><Plus size={20} className="text-green-600"/> Add New Advertisement</>}
                  </h2>
                  
                  {error && (
                      <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                          <AlertCircle size={16} /> {error}
                      </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title</label>
                          <input 
                              type="text" 
                              required
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="e.g. Diwali Sale 50% Off"
                              value={formData.title}
                              onChange={e => setFormData({...formData, title: e.target.value})}
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                          <select 
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                              value={formData.placement}
                              onChange={e => setFormData({...formData, placement: e.target.value as 'hero' | 'header'})}
                          >
                              <option value="hero">Hero Carousel (Home)</option>
                              <option value="header">Header Top Bar</option>
                          </select>
                      </div>

                      {formData.placement === 'hero' && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                              <input 
                                  type="url" 
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  placeholder="https://example.com/image.jpg"
                                  value={formData.imageUrl}
                                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                              />
                              <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x400px</p>
                              {formData.imageUrl && (
                                  <div className="mt-2 h-24 w-full bg-gray-100 rounded overflow-hidden border">
                                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '')} />
                                  </div>
                              )}
                          </div>
                      )}

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                          <input 
                              type="text" 
                              required
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="/shop?cat=Electronics"
                              value={formData.link}
                              onChange={e => setFormData({...formData, link: e.target.value})}
                          />
                      </div>

                      <div className="flex gap-2 pt-2">
                          <button 
                              type="submit" 
                              className={`flex-1 text-white py-2 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                          >
                              {editingId ? <><Save size={18} /> Update Ad</> : <><Plus size={18} /> Add Ad</>}
                          </button>
                          {editingId && (
                              <button 
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                              >
                                  Cancel
                              </button>
                          )}
                      </div>
                  </form>
              </div>
          </div>

          {/* Existing Ads List */}
          <div className="lg:col-span-2 space-y-6">
              {/* Hero Ads */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center justify-between">
                      <span>Hero Carousel Ads</span>
                      <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded">Drag to Reorder</span>
                  </h3>
                  {renderAdList('hero')}
              </div>

              {/* Header Ads */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center justify-between">
                      <span>Header Top Bar Ads</span>
                      <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded">Drag to Reorder</span>
                  </h3>
                  {renderAdList('header')}
              </div>
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-scaleIn">
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                      <AlertCircle size={28} />
                      <h3 className="text-xl font-bold">Delete Advertisement?</h3>
                  </div>
                  <p className="text-gray-600 mb-6">Are you sure you want to delete this ad? This action cannot be undone.</p>
                  <div className="flex gap-3 justify-end">
                      <button 
                          onClick={() => setDeleteConfirmationId(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={confirmDelete}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-lg shadow-red-100"
                      >
                          Yes, Delete
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminAds;
