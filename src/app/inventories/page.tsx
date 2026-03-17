'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import InventorySearch from '@/components/inventories/InventorySearch';
import InventoryGrid from '@/components/inventories/InventoryGrid';
import InventoryForm from '@/components/inventories/InventoryForm';
import Modal from '@/components/common/Modal';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Alert from '@/components/common/Alert';
import { useInventories } from '@/hooks/useInventories';
import styles from './page.module.css'; // Reusing common page styles if possible, let's create a new one to be sure

export default function InventoriesPage() {
  const {
    paginatedInventories,
    isLoading,
    searchQuery, setSearchQuery,
    branchFilter, setBranchFilter,
    quantityFilter, setQuantityFilter,
    sortOrder, setSortOrder,
    currentPage, setCurrentPage,
    totalPages,
    isFormModalOpen, setIsFormModalOpen,
    isConfirmModalOpen, setIsConfirmModalOpen,
    selectedInventory,
    alert, closeAlert,
    openCreateModal,
    openDeleteConfirm,
    handleCreate,
    handleDelete
  } = useInventories();

  return (
    <div className={styles.wrapper}>
      <Header sectionTitle="Estoques" />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <InventorySearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            quantityFilter={quantityFilter}
            setQuantityFilter={setQuantityFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {isLoading ? (
            <p className={styles.loading}>Carregando estoques...</p>
          ) : (
            <InventoryGrid 
              inventories={paginatedInventories}
              onDelete={openDeleteConfirm}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

        </div>
      </main>

      <button 
        className={styles.fab} 
        onClick={openCreateModal}
        title="Criar Novo Estoque"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <Footer />

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Novo Estoque"
      >
        <InventoryForm 
          onSubmit={handleCreate}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Estoque"
        message={`Deseja realmente excluir este estoque?`}
        confirmText="Sim, excluir"
        type="danger"
      />

      <Alert 
        isVisible={alert.isVisible}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
}
