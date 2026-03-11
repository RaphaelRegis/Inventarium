'use client';

import { useState, useMemo, useEffect } from 'react';
import { Branch } from '@/entities/branches/Branch';
import * as actions from '@/app/branches/actions';

export function useBranches(initialBranches: Branch[] = []) {
    // Data state
    const [branches, setBranches] = useState<Branch[]>(initialBranches);
    const [isLoading, setIsLoading] = useState(false);

    // Search/Filters/Sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modals state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);

    // Alert state
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    // Reload data
    const refreshBranches = async () => {
        setIsLoading(true);
        try {
            const data = await actions.fetchAllBranches();
            setBranches(data);
        } catch (e) {
            handleAlert('Erro ao carregar filiais', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshBranches();
    }, []);

    const handleAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, isVisible: true });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    // Logic for filtering and sorting
    const filteredBranches = useMemo(() => {
        return branches
            .filter(branch => {
                const query = searchQuery.toLowerCase();
                return (
                    branch.name.toLowerCase().includes(query) ||
                    branch.address.toLowerCase().includes(query) ||
                    (branch.email && branch.email.toLowerCase().includes(query)) ||
                    (branch.phoneNumber && branch.phoneNumber.includes(query))
                );
            })
            .sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (sortOrder === 'asc') return nameA.localeCompare(nameB);
                return nameB.localeCompare(nameA);
            });
    }, [branches, searchQuery, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage) || 1;
    const paginatedBranches = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBranches.slice(start, start + itemsPerPage);
    }, [filteredBranches, currentPage]);

    useEffect(() => {
        // Reset to page 1 when search changes
        setCurrentPage(1);
    }, [searchQuery]);

    // CRUD handlers
    const handleCreate = async (data: Partial<Branch>) => {
        try {
            await actions.createBranch(data);
            handleAlert('Filial cadastrada com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshBranches();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao cadastrar filial', 'error');
        }
    };

    const handleUpdate = async (data: Partial<Branch>) => {
        if (!selectedBranch) return;
        try {
            await actions.updateBranch(selectedBranch.id, data);
            handleAlert('Filial atualizada com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshBranches();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao atualizar filial', 'error');
        }
    };

    const handleDelete = async () => {
        if (!selectedBranch) return;
        try {
            await actions.deleteBranch(selectedBranch.id);
            handleAlert('Filial removida com sucesso!', 'success');
            setIsConfirmModalOpen(false);
            refreshBranches();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao excluir filial', 'error');
        }
    };

    const openCreateModal = () => {
        setSelectedBranch(undefined);
        setIsFormModalOpen(true);
    };

    const openEditModal = (branch: Branch) => {
        setSelectedBranch(branch);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (branch: Branch) => {
        setSelectedBranch(branch);
        setIsConfirmModalOpen(true);
    };

    return {
        // State
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

        // Actions
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshBranches
    };
}
