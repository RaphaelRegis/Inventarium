'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CustomerSearch from '@/components/customers/CustomerSearch';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerForm from '@/components/customers/CustomerForm';
import Modal from '@/components/common/Modal';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Alert from '@/components/common/Alert';
import { useCustomers } from '@/hooks/useCustomers';
import styles from './page.module.css';

export default function CustomersPage() {
    const {
        paginatedCustomers,
        isLoading,
        searchQuery, setSearchQuery,
        sortField, setSortField,
        sortOrder, setSortOrder,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        isConfirmModalOpen, setIsConfirmModalOpen,
        selectedCustomer,
        alert, closeAlert,
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useCustomers();

    return (
        <div className={styles.wrapper}>
            <Header sectionTitle="Clientes" />

            <main className={styles.main}>
                <div className={styles.container}>
                    <CustomerSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortField={sortField}
                        setSortField={setSortField}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    <CustomerTable
                        customers={paginatedCustomers}
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
                title="Criar Novo Cliente"
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
                title={selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            >
                <CustomerForm
                    customer={selectedCustomer}
                    onSubmit={selectedCustomer ? handleUpdate : handleCreate}
                    onCancel={() => setIsFormModalOpen(false)}
                />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Excluir Cliente"
                message={`Deseja realmente excluir o cliente "${selectedCustomer?.name}"? Esta ação não pode ser desfeita.`}
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
