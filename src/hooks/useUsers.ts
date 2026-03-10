'use client';

import { useState, useMemo, useEffect } from 'react';
import { User, UserRole } from '@/entities/users/User';
import * as actions from '@/app/users/actions';

export function useUsers(initialUsers: User[] = []) {
  // Data state
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);

  // Search/Filters/Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [taxFilter, setTaxFilter] = useState<'ALL' | 'CPF' | 'CNPJ'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Alert state
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Reload data
  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const data = await actions.fetchAllUsers();
      setUsers(data);
    } catch (e) {
      handleAlert('Erro ao carregar usuários', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type, isVisible: true });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  };

  // Logic for filtering and sorting
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.taxIdentification.includes(query) ||
          (user.phoneNumber && user.phoneNumber.includes(query));
        
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        
        let matchesTax = true;
        if (taxFilter === 'CPF') matchesTax = user.taxIdentification.length <= 11;
        if (taxFilter === 'CNPJ') matchesTax = user.taxIdentification.length > 11;

        return matchesQuery && matchesRole && matchesTax;
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === 'asc') return nameA.localeCompare(nameB);
        return nameB.localeCompare(nameA);
      });
  }, [users, searchQuery, roleFilter, taxFilter, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchQuery, roleFilter, taxFilter]);

  // CRUD handlers
  const handleCreate = async (data: Partial<User>) => {
    try {
      await actions.createUser(data);
      handleAlert('Usuário cadastrado com sucesso!', 'success');
      setIsFormModalOpen(false);
      refreshUsers();
    } catch (e: any) {
      handleAlert(e.message || 'Erro ao cadastrar usuário', 'error');
    }
  };

  const handleUpdate = async (data: Partial<User>) => {
    if (!selectedUser) return;
    try {
      await actions.updateUser(selectedUser.id, data);
      handleAlert('Usuário atualizado com sucesso!', 'success');
      setIsFormModalOpen(false);
      refreshUsers();
    } catch (e: any) {
      handleAlert(e.message || 'Erro ao atualizar usuário', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await actions.deleteUser(selectedUser.id);
      handleAlert('Usuário removido com sucesso!', 'success');
      setIsConfirmModalOpen(false);
      refreshUsers();
    } catch (e: any) {
      handleAlert(e.message || 'Erro ao excluir usuário', 'error');
    }
  };

  const openCreateModal = () => {
    setSelectedUser(undefined);
    setIsFormModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  return {
    // State
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
    
    // Actions
    openCreateModal,
    openEditModal,
    openDeleteConfirm,
    handleCreate,
    handleUpdate,
    handleDelete,
    refreshUsers
  };
}
