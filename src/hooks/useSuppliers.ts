'use client';

import { useState, useMemo, useEffect } from 'react';
import { Supplier } from '@/entities/suppliers/Supplier';
import * as actions from '@/app/suppliers/actions';

export function useSuppliers(initialSuppliers: Supplier[] = []) {
    // Data state
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [isLoading, setIsLoading] = useState(false);

    // Search/Sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<'name' | 'debt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modals state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);

    // Alert state
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    // Reload data
    const refreshSuppliers = async () => {
        setIsLoading(true);
        try {
            const data = await actions.fetchAllSuppliers();
            setSuppliers(data as Supplier[]);
        } catch (e) {
            handleAlert('Erro ao carregar fornecedores', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshSuppliers();
    }, []);

    const handleAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, isVisible: true });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    // Logic for filtering and sorting
    const filteredSuppliers = useMemo(() => {
        return suppliers
            .filter(supplier => {
                const query = searchQuery.toLowerCase();
                return (
                    supplier.name.toLowerCase().includes(query) ||
                    (supplier.email && supplier.email.toLowerCase().includes(query)) ||
                    (supplier.phoneNumber && supplier.phoneNumber.includes(query))
                );
            })
            .sort((a, b) => {
                if (sortField === 'name') {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    if (sortOrder === 'asc') return nameA.localeCompare(nameB);
                    return nameB.localeCompare(nameA);
                } else {
                    const debtA = Number(a.debt);
                    const debtB = Number(b.debt);
                    if (sortOrder === 'asc') return debtA - debtB;
                    return debtB - debtA;
                }
            });
    }, [suppliers, searchQuery, sortField, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;
    const paginatedSuppliers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSuppliers.slice(start, start + itemsPerPage);
    }, [filteredSuppliers, currentPage]);

    useEffect(() => {
        // Reset to page 1 when search or sorting changes
        setCurrentPage(1);
    }, [searchQuery, sortField, sortOrder]);

    // CRUD handlers
    const handleCreate = async (data: Partial<Supplier>) => {
        try {
            await actions.createSupplier(data);
            handleAlert('Fornecedor cadastrado com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshSuppliers();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao cadastrar fornecedor', 'error');
        }
    };

    const handleUpdate = async (data: Partial<Supplier>) => {
        if (!selectedSupplier) return;
        try {
            await actions.updateSupplier(selectedSupplier.id, data);
            handleAlert('Fornecedor atualizado com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshSuppliers();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao atualizar fornecedor', 'error');
        }
    };

    const handleDelete = async () => {
        if (!selectedSupplier) return;
        try {
            await actions.deleteSupplier(selectedSupplier.id);
            handleAlert('Fornecedor removido com sucesso!', 'success');
            setIsConfirmModalOpen(false);
            refreshSuppliers();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao excluir fornecedor', 'error');
        }
    };

    const openCreateModal = () => {
        setSelectedSupplier(undefined);
        setIsFormModalOpen(true);
    };

    const openEditModal = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsConfirmModalOpen(true);
    };

    return {
        // State
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

        // Actions
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshSuppliers
    };
}
