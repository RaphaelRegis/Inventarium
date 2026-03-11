'use client';

import { useState, useMemo, useEffect } from 'react';
import { Customer } from '@/entities/customers/Customer';
import * as actions from '@/app/customers/actions';

export function useCustomers(initialCustomers: Customer[] = []) {
    // Data state
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
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
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

    // Alert state
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    // Reload data
    const refreshCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await actions.fetchAllCustomers();
            setCustomers(data as Customer[]);
        } catch (e) {
            handleAlert('Erro ao carregar clientes', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshCustomers();
    }, []);

    const handleAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, isVisible: true });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    // Logic for filtering and sorting
    const filteredCustomers = useMemo(() => {
        return customers
            .filter(customer => {
                const query = searchQuery.toLowerCase();
                return (
                    customer.name.toLowerCase().includes(query) ||
                    customer.address.toLowerCase().includes(query) ||
                    (customer.email && customer.email.toLowerCase().includes(query)) ||
                    (customer.phoneNumber && customer.phoneNumber.includes(query))
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
    }, [customers, searchQuery, sortField, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
    const paginatedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(start, start + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    useEffect(() => {
        // Reset to page 1 when search or sorting changes
        setCurrentPage(1);
    }, [searchQuery, sortField, sortOrder]);

    // CRUD handlers
    const handleCreate = async (data: Partial<Customer>) => {
        try {
            await actions.createCustomer(data);
            handleAlert('Cliente cadastrado com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshCustomers();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao cadastrar cliente', 'error');
        }
    };

    const handleUpdate = async (data: Partial<Customer>) => {
        if (!selectedCustomer) return;
        try {
            await actions.updateCustomer(selectedCustomer.id, data);
            handleAlert('Cliente atualizado com sucesso!', 'success');
            setIsFormModalOpen(false);
            refreshCustomers();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao atualizar cliente', 'error');
        }
    };

    const handleDelete = async () => {
        if (!selectedCustomer) return;
        try {
            await actions.deleteCustomer(selectedCustomer.id);
            handleAlert('Cliente removido com sucesso!', 'success');
            setIsConfirmModalOpen(false);
            refreshCustomers();
        } catch (e: any) {
            handleAlert(e.message || 'Erro ao excluir cliente', 'error');
        }
    };

    const openCreateModal = () => {
        setSelectedCustomer(undefined);
        setIsFormModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsConfirmModalOpen(true);
    };

    return {
        // State
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

        // Actions
        openCreateModal,
        openEditModal,
        openDeleteConfirm,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshCustomers
    };
}
