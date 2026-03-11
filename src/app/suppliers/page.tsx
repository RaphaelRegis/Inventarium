'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SupplierSearch from '@/components/suppliers/SupplierSearch';
import SupplierTable from '@/components/suppliers/SupplierTable';
import SupplierForm from '@/components/suppliers/SupplierForm';
import Modal from '@/components/common/Modal';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Alert from '@/components/common/Alert';
import { useSuppliers } from '@/hooks/useSuppliers';
import styles from './page.module.css';

export default function SuppliersPage() {
    const {
        paginatedSuppliers,
        isLoading,
        searchQuery, setSearchQuery,
        sortField, setSortField,
        sortOrder, setSortOrder,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        isConfirmModalOpen, setIsConfirmModalOpen,
        selectedSupplier,
        alert, closeAlert,
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useSuppliers();

    return (
        <div className={styles.wrapper}>
            <Header sectionTitle="Fornecedores" />

            <main className={styles.main}>
                <div className={styles.container}>
                    <SupplierSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortField={sortField}
                        setSortField={setSortField}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    <SupplierTable
                        suppliers={paginatedSuppliers}
                        onEdit={openEditModal}
                        onDelete={openDeleteConfirm}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            {/* Floating Action Button */}
            <button
                className={styles.fab}
                onClick={openCreateModal}
                title="Criar Novo Fornecedor"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>

            <Footer />

            {/* Modals */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={selectedSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            >
                <SupplierForm
                    supplier={selectedSupplier}
                    onSubmit={selectedSupplier ? handleUpdate : handleCreate}
                    onCancel={() => setIsFormModalOpen(false)}
                />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Excluir Fornecedor"
                message={`Deseja realmente excluir o fornecedor "${selectedSupplier?.name}"? Esta ação não pode ser desfeita.`}
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
