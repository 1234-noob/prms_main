import React, { useState, useEffect } from 'react';
import { Plus, X, FileText, Receipt, Settings, Eye, Trash2, Calendar, Code, AlertCircle, Edit, Menu } from 'lucide-react';
import TemplateModal from './Templates/TemplateModal'; 
import { getAllTemplateTypes, getAllTemplates, createTemplateType, createTemplate, updateTemplate, updateTemplateType, deleteTemplate, deleteTemplateType, getTemplateById } from './Invoices/core/_requests'; 

interface TemplateType {
  id: number;
  type: 'Invoice' | 'Receipt';
  description: string;
  is_active?: boolean; 
  created_at: string;
  updated_at: string;
}

interface Template {
  id: number;
  organization_id: number;
  template_type_id: number;
  is_active: boolean;
  html_content: string;
  layout_type: string | null;
  logo_url: string | null;
  primary_color: string | null;
  font_family: string | null;
  show_discount: boolean;
  show_qr_code: boolean;
  custom_labels: { [key: string]: string } | null;
  footer_note: string | null;
  date_format: string | null;
  currency_format: string | null;
  receipt_background_url: string | null;
  created_at: string;
  updated_at: string;
  template_type?: TemplateType;
}

type ItemType = TemplateType | Template;

const isTemplate = (item: ItemType): item is Template => {
  return 'html_content' in item;
};

const InvoiceTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'template-types' | 'templates'>('all');
  const [editingItem, setEditingItem] = useState<Template | TemplateType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modalInitialMode, setModalInitialMode] = useState<'template-type' | 'template'>('template-type');

  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [templateTypesData, templatesData] = await Promise.all([
        getAllTemplateTypes(),
        getAllTemplates()
      ]);
      setTemplateTypes(templateTypesData);
      setTemplates(templatesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplateType = async (templateTypeData: any) => {
    try {
      const newTemplateType = await createTemplateType(templateTypeData);
      setTemplateTypes(prev => [...prev, newTemplateType]);
      setSuccessMessage(`Template type "${newTemplateType.type}" created successfully!`);
      setError(null);
      return newTemplateType;
    } catch (err: any) {
      setError(err.message || 'Failed to create template type');
      throw err; 
    }
  };

  
  const handleCreateTemplate = async (templateData: any) => {
    try {
      console.log('Creating template with data:', JSON.stringify(templateData, null, 2)); 
      
      
      if (!templateData.organization_id) {
        throw new Error('Organization ID is required');
      }
      if (!templateData.template_type_id) {
        throw new Error('Template type ID is required');
      }
      if (!templateData.html_content || !templateData.html_content.trim()) {
        throw new Error('HTML content is required');
      }
      
      const newTemplate = await createTemplate(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      setSuccessMessage(`Template #${newTemplate.id} created successfully!`);
      setError(null);
    } catch (err: any) {
      console.error('Template creation error:', err); 
      setError(err.message || 'Failed to create template');
      throw err; 
    }
  };

  const handleUpdateTemplateType = async (id: number, templateTypeData: any) => {
    try {
      const updatedTemplateType = await updateTemplateType(id, templateTypeData);
      setTemplateTypes(prev => prev.map(tt => tt.id === id ? updatedTemplateType : tt));
      setEditingItem(null);
      setSuccessMessage(`Template type "${updatedTemplateType.type}" updated successfully!`);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update template type');
      throw err; 
    }
  };

  const handleUpdateTemplate = async (id: number, templateData: any) => {
    try {
      console.log('Updating template with data:', JSON.stringify(templateData, null, 2)); 
      const updatedTemplate = await updateTemplate(id, templateData);
      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
      setEditingItem(null);
      setSuccessMessage(`Template #${updatedTemplate.id} updated successfully!`);
      setError(null);
    } catch (err: any) {
      console.error('Template update error:', err); 
      setError(err.message || 'Failed to update template');
      throw err; 
    }
  };

  const handleEditItem = async (item: Template | TemplateType) => {
    try {
      setEditingItem(item);
      setModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load item for editing');
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      setSuccessMessage('Template deleted successfully!');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
    }
  };

  const handleDeleteTemplateType = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template type? This may affect associated templates.')) return;
    
    try {
      await deleteTemplateType(id);
      setTemplateTypes(prev => prev.filter(tt => tt.id !== id));
      setSuccessMessage('Template type deleted successfully!');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete template type');
    }
  };

  const handlePreviewTemplate = async (id: number) => {
    try {
      const htmlContent = await getTemplateById(id);
      setPreviewHtml(htmlContent);
      setPreviewModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch template preview');
    }
  };

  const handleOpenModalForTemplateType = () => {
    setEditingItem(null);
    setModalInitialMode('template-type');
    setModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleOpenModalForTemplate = () => {
    setEditingItem(null);
    setModalInitialMode('template');
    setModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTemplateTypeInfo = (templateTypeId: number) => {
    return templateTypes.find(tt => tt.id === templateTypeId);
  };

  const getFilteredItems = () => {
    const allItems: ItemType[] = [];
    
    if (filter === 'all' || filter === 'template-types') {
      allItems.push(...templateTypes);
    }
    
    if (filter === 'all' || filter === 'templates') {
      allItems.push(...templates);
    }

    return allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const filteredItems = getFilteredItems();

  const getHeaderAction = () => {
    if (templateTypes.length === 0) {
      return (
        <button
          onClick={handleOpenModalForTemplateType}
          className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm font-medium"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Template Type</span>
          <span className="sm:hidden">Create</span>
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={handleOpenModalForTemplateType}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm font-medium"
            disabled={loading}
          >
            <Settings className="w-4 h-4" />
            <span>Template Type</span>
          </button>
          <button
            onClick={handleOpenModalForTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
            disabled={loading}
          >
            <FileText className="w-4 h-4" />
            <span>Template</span>
          </button>
        </div>
        
        
        <div className="sm:hidden relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-blue-600 text-white p-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {mobileMenuOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-10">
              <button
                onClick={handleOpenModalForTemplateType}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4 text-green-600" />
                <span>Template Type</span>
              </button>
              <button
                onClick={handleOpenModalForTemplate}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Template</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getEmptyStateAction = () => {
    if (templateTypes.length === 0) {
      return (
        <button
          onClick={handleOpenModalForTemplateType}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <Settings className="w-4 h-4" />
          <span>Create Template Type First</span>
        </button>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
        <button
          onClick={handleOpenModalForTemplateType}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Settings className="w-4 h-4" />
          <span>Template Type</span>
        </button>
        <button
          onClick={handleOpenModalForTemplate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <FileText className="w-4 h-4" />
          <span>Template</span>
        </button>
      </div>
    );
  };

  const getEmptyStateMessage = () => {
    if (filter === 'template-types') {
      return templateTypes.length === 0 
        ? 'Create template types to define configurations for your templates.'
        : 'No template types match your current filter.';
    }
    
    if (filter === 'templates') {
      if (templateTypes.length === 0) {
        return 'Create a template type first before adding templates.';
      }
      return templates.length === 0
        ? 'Create your first template using one of the existing template types.'
        : 'No templates match your current filter.';
    }
    
    if (templateTypes.length === 0 && templates.length === 0) {
      return 'Get started by creating a template type first, then you can create templates.';
    }
    
    return 'No items match your current filter.';
  };

  
  useEffect(() => {
    const handleClickOutside = () => setMobileMenuOpen(false);
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">Template Management</h1>
              <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">
                {templateTypes.length === 0 
                  ? 'Create template types first, then build templates based on those types.'
                  : 'Manage your template types and templates for invoice and receipt generation.'
                }
              </p>
            </div>
            <div className="flex-shrink-0">
              {getHeaderAction()}
            </div>
          </div>
          
          
          {successMessage && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center">
                <div className="w-5 h-5 text-green-500 mr-2 flex-shrink-0">✓</div>
                <span className="text-green-700 text-sm md:text-base flex-1 min-w-0">{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="ml-2 text-green-500 hover:text-green-700 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
        
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-700 text-sm md:text-base flex-1 min-w-0">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-blue-500" />
                  Templates & Template Types
                </h2>
                <p className="mt-1 text-xs md:text-sm text-gray-600">
                  {templateTypes.length === 0 
                    ? 'Create template types first to get started with template management'
                    : 'Manage template types and template configurations for invoice and receipt generation'
                  }
                </p>
              </div>
            </div>

           
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-100 rounded-lg p-1 w-full sm:w-fit">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                All ({templateTypes.length + templates.length})
              </button>
              <button
                onClick={() => setFilter('template-types')}
                className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  filter === 'template-types' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Template Types ({templateTypes.length})
              </button>
              <button
                onClick={() => setFilter('templates')}
                className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  filter === 'templates' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Templates ({templates.length})
              </button>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading data...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  {filter === 'template-types' ? 'No Template Types' : 
                   filter === 'templates' ? 'No Templates' : 'No Items'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm md:text-base px-4">
                  {getEmptyStateMessage()}
                </p>
                <div className="px-4">
                  {getEmptyStateAction()}
                </div>
              </div>
            ) : (
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredItems.map(item => {
                  if (isTemplate(item)) {
                    
                    const templateType = getTemplateTypeInfo(item.template_type_id);
                    return (
                      <div key={`template-${item.id}`} className="bg-purple-50 border border-purple-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`p-1.5 rounded flex-shrink-0 ${item.is_active ? 'bg-purple-100' : 'bg-red-100'}`}>
                                {templateType?.type === 'Invoice' ? (
                                  <FileText className={`w-3 h-3 md:w-4 md:h-4 ${item.is_active ? 'text-purple-600' : 'text-red-600'}`} />
                                ) : (
                                  <Receipt className={`w-3 h-3 md:w-4 md:h-4 ${item.is_active ? 'text-purple-600' : 'text-red-600'}`} />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2 flex-wrap">
                                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">Template #{item.id}</h3>
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium flex-shrink-0">
                                    Template
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {templateType?.type} - {templateType?.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-3">
                              <span className="flex-shrink-0">Org: {item.organization_id}</span>
                              <span className={`px-2 py-1 rounded-full flex-shrink-0 ${
                                item.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                            <button 
                              onClick={() => handleEditItem(item)}
                              className="p-1.5 hover:bg-blue-200 rounded transition-colors" 
                              title="Edit"
                            >
                              <Edit className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                            </button>
                            <button 
                              onClick={() => handlePreviewTemplate(item.id)}
                              className="p-1.5 hover:bg-purple-200 rounded transition-colors" 
                              title="Preview"
                            >
                              <Eye className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTemplate(item.id)}
                              className="p-1.5 hover:bg-red-100 rounded transition-colors" 
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        
                        
                        <div className="bg-white p-2 md:p-3 rounded border space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Layout:</span>
                            <span className="font-medium text-gray-900 truncate ml-2">{item.layout_type || 'Default'}</span>
                          </div>
                          
                          {item.primary_color && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Color:</span>
                              <div className="flex items-center space-x-1 ml-2">
                                <div 
                                  className="w-3 h-3 rounded-full border flex-shrink-0"
                                  style={{ backgroundColor: item.primary_color }}
                                ></div>
                                <span className="font-medium text-gray-900 text-xs truncate">{item.primary_color}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Font:</span>
                            <span className="font-medium text-gray-900 truncate ml-2">{item.font_family || 'Default'}</span>
                          </div>
                          
                          <div className="flex items-center justify-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${item.show_discount ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-gray-600">Discount</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${item.show_qr_code ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-gray-600">QR Code</span>
                            </div>
                          </div>

                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Date Format:</span>
                              <span className="font-medium text-gray-900 truncate ml-2">{item.date_format || 'Default'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span className="text-gray-500">Currency:</span>
                              <span className="font-medium text-gray-900 truncate ml-2">{item.currency_format || 'Default'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-3 flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Created: {formatDate(item.created_at)}</span>
                          </div>
                          <div className="flex items-center ml-2 flex-shrink-0">
                            <Code className="w-3 h-3 mr-1" />
                            <span>HTML</span>
                          </div>
                        </div>

                        {item.footer_note && (
                          <div className="mt-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                            <strong>Footer:</strong> <span className="break-words">{item.footer_note.substring(0, 50)}{item.footer_note.length > 50 ? '...' : ''}</span>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    
                    const associatedTemplates = templates.filter(t => t.template_type_id === item.id);
                    return (
                      <div key={`template-type-${item.id}`} className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 md:space-x-3 mb-2">
                              <div className="p-1.5 md:p-2 bg-green-100 rounded flex-shrink-0">
                                {item.type === 'Invoice' ? (
                                  <FileText className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                                ) : (
                                  <Receipt className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2 flex-wrap">
                                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{item.type}</h3>
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium flex-shrink-0">
                                    Template Type
                                  </span>
                                </div>
                               
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                  }`}>
                                    {item.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">{item.description}</p>
                              </div>
                            </div>
                            
                            {/* Show associated templates count */}
                            {associatedTemplates.length > 0 && (
                              <div className="bg-white p-2 rounded border mt-3">
                                <div className="text-xs text-gray-600 flex items-center justify-between">
                                  <span>Associated Templates:</span>
                                  <span className="font-medium text-green-600">{associatedTemplates.length}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Active: {associatedTemplates.filter(t => t.is_active).length} | 
                                  Inactive: {associatedTemplates.filter(t => !t.is_active).length}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                            <button 
                              onClick={() => handleEditItem(item)}
                              className="p-1 hover:bg-blue-100 rounded" 
                              title="Edit"
                            >
                              <Edit className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTemplateType(item.id)}
                              className="p-1 hover:bg-red-100 rounded" 
                              title="Delete"
                              disabled={associatedTemplates.length > 0}
                            >
                              <Trash2 className={`w-3 h-3 md:w-4 md:h-4 ${associatedTemplates.length > 0 ? 'text-gray-400' : 'text-red-500'}`} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center justify-between">
                            <span>ID: {item.id}</span>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span className="truncate">{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <button
                            onClick={() => {
                              setModalInitialMode('template');
                              setEditingItem(null);
                              setModalOpen(true);
                            }}
                            className="w-full text-xs bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Create Template</span>
                          </button>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>

     
      <TemplateModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSaveTemplate={handleCreateTemplate}
        onSaveTemplateType={handleCreateTemplateType}
        onUpdateTemplate={handleUpdateTemplate}
        onUpdateTemplateType={handleUpdateTemplateType}
        templateTypes={templateTypes}
        templates={templates}
        editingItem={editingItem}
        initialMode={modalInitialMode}
        forceMode={editingItem !== null}
      />

     
      {previewModalOpen && previewHtml && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Template Preview</h3>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div 
                className="border border-gray-200 rounded-lg p-2 md:p-4 bg-white w-full max-w-full overflow-auto"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplates;