'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BranchSearch from '@/components/branches/BranchSearch';
import BranchTable from '@/components/branches/BranchTable';
import BranchForm from '@/components/branches/BranchForm';
import Modal from '@/components/common/Modal';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Alert from '@/components/common/Alert';
import { useBranches } from '@/hooks/useBranches';
import styles from './page.module.css';

export default function BranchesPage() {
    const {
        paginatedBranches,
        isLoading,
        searchQuery, setSearchQuery,
        sortOrder, setSortOrder,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        isConfirmModalOpen, setIsConfirmModalOpen,
        selectedBranch,
        alert, closeAlert,
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useBranches();

    return (
        <div className={styles.wrapper}>
            <Header sectionTitle="Filiais" />

            <main className={styles.main}>
                <div className={styles.container}>
                    <BranchSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    <BranchTable
                        branches={paginatedBranches}
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
                title="Criar Nova Filial"
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
                title={selectedBranch ? 'Editar Filial' : 'Nova Filial'}
            >
                <BranchForm
                    branch={selectedBranch}
                    onSubmit={selectedBranch ? handleUpdate : handleCreate}
                    onCancel={() => setIsFormModalOpen(false)}
                />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Excluir Filial"
                message={`Deseja realmente excluir a filial "${selectedBranch?.name}"? Esta ação não pode ser desfeita.`}
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
