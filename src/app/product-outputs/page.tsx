'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductOutputSearch from '@/components/product-outputs/ProductOutputSearch';
import ProductOutputTable from '@/components/product-outputs/ProductOutputTable';
import ProductOutputForm from '@/components/product-outputs/ProductOutputForm';
import Modal from '@/components/common/Modal';
import Alert from '@/components/common/Alert';
import { useProductOutputs } from '@/hooks/useProductOutputs';
import styles from '@/app/product-entries/page.module.css';

export default function ProductOutputsPage() {
  const {
    paginatedOutputs,
    isLoading,
    searchQuery, setSearchQuery,
    branchFilter, setBranchFilter,
    dateSort, setDateSort,
    valueSort, setValueSort,
    currentPage, setCurrentPage,
    totalPages,
    isFormModalOpen, setIsFormModalOpen,
    alert, closeAlert,
    openCreateModal,
    handleCreate
  } = useProductOutputs();

  return (
    <div className={styles.wrapper}>
      <Header sectionTitle="Saídas de Produtos" />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <ProductOutputSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            dateSort={dateSort}
            setDateSort={setDateSort}
            valueSort={valueSort}
            setValueSort={setValueSort}
          />

          {isLoading ? (
            <p className={styles.loading}>Carregando saídas...</p>
          ) : (
            <ProductOutputTable 
              outputs={paginatedOutputs}
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
        title="Registrar Nova Saída"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      <Footer />

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Nova Saída"
      >
        <ProductOutputForm 
          onSubmit={handleCreate}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <Alert 
        isVisible={alert.isVisible}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
}
