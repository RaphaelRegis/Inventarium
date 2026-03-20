'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductEntrySearch from '@/components/product-entries/ProductEntrySearch';
import ProductEntryTable from '@/components/product-entries/ProductEntryTable';
import ProductEntryForm from '@/components/product-entries/ProductEntryForm';
import Modal from '@/components/common/Modal';
import Alert from '@/components/common/Alert';
import { useProductEntries } from '@/hooks/useProductEntries';
import styles from './page.module.css';

export default function ProductEntriesPage() {
  const {
    paginatedEntries,
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
    handleCreate,
    getEntryTotalValue
  } = useProductEntries();

  return (
    <div className={styles.wrapper}>
      <Header sectionTitle="Entradas de Produtos" />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <ProductEntrySearch 
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
            <p className={styles.loading}>Carregando entradas...</p>
          ) : (
            <ProductEntryTable 
              entries={paginatedEntries}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              getValue={getEntryTotalValue}
            />
          )}

        </div>
      </main>

      <button 
        className={styles.fab} 
        onClick={openCreateModal}
        title="Registrar Nova Entrada"
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
        title="Nova Entrada"
      >
        <ProductEntryForm 
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
