'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import UserSearch from '@/components/users/UserSearch';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import Modal from '@/components/common/Modal';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Alert from '@/components/common/Alert';
import { useUsers } from '@/hooks/useUsers';
import styles from './page.module.css';

export default function UsersPage() {
  const {
    paginatedUsers,
    isLoading,
    searchQuery, setSearchQuery,
    roleFilter, setRoleFilter,
    taxFilter, setTaxFilter,
    sortOrder, setSortOrder,
    currentPage, setCurrentPage,
    totalPages,
    isFormModalOpen, setIsFormModalOpen,
    isConfirmModalOpen, setIsConfirmModalOpen,
    selectedUser,
    alert, closeAlert,
    openCreateModal,
    openEditModal,
    openDeleteConfirm,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useUsers();

  return (
    <div className={styles.wrapper}>
      <Header sectionTitle="Usuários" />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <UserSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            taxFilter={taxFilter}
            setTaxFilter={setTaxFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <UserTable 
            users={paginatedUsers}
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
        title="Criar Novo Usuário"
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
        title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <UserForm 
          user={selectedUser}
          onSubmit={selectedUser ? handleUpdate : handleCreate}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        message={`Deseja realmente excluir o usuário "${selectedUser?.name}"? Esta ação não pode ser desfeita.`}
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
