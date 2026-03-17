'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductSearch from '@/components/products/ProductSearch';
import ProductTable from '@/components/products/ProductTable';
import ProductForm from '@/components/products/ProductForm';
import Modal from '@/components/common/Modal';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Alert from '@/components/common/Alert';
import { useProducts } from '@/hooks/useProducts';
import styles from './page.module.css';

export default function ProductsPage() {
    const {
        paginatedProducts,
        isLoading,
        searchQuery, setSearchQuery,
        sortOrder, setSortOrder,
        currentPage, setCurrentPage,
        totalPages,
        isFormModalOpen, setIsFormModalOpen,
        isConfirmModalOpen, setIsConfirmModalOpen,
        selectedProduct,
        alert, closeAlert,
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useProducts();

    return (
        <div className={styles.wrapper}>
            <Header sectionTitle="Produtos" />

            <main className={styles.main}>
                <div className={styles.container}>
                    <ProductSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    <ProductTable
                        products={paginatedProducts}
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
                title="Criar Novo Produto"
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
                title={selectedProduct ? 'Editar Produto' : 'Novo Produto'}
            >
                <ProductForm
                    product={selectedProduct}
                    onSubmit={selectedProduct ? handleUpdate : handleCreate}
                    onCancel={() => setIsFormModalOpen(false)}
                />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Excluir Produto"
                message={`Deseja realmente excluir o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
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
