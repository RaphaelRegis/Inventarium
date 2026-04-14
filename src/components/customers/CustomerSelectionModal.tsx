'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/common/Modal';
import * as customerActions from '@/app/customers/actions';
import { Customer } from '@/entities/customers/Customer';
import CustomerForm from './CustomerForm';
import styles from '@/components/products/SupplierSelectionModal.module.css';

interface CustomerSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCustomerIds: string[];
    onSelect: (ids: string[]) => void;
}

export default function CustomerSelectionModal({
    isOpen,
    onClose,
    selectedCustomerIds,
    onSelect
}: CustomerSelectionModalProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const loadCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await customerActions.fetchAllCustomers();
            setCustomers(data as Customer[]);
        } catch (error) {
            console.error('Failed to load customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadCustomers();
        }
    }, [isOpen]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);

    const handleToggleCustomer = (id: string) => {
        if (selectedCustomerIds.includes(id)) {
            onSelect(selectedCustomerIds.filter(cid => cid !== id));
        } else {
            onSelect([...selectedCustomerIds, id]);
        }
    };

    const handleCreateCustomer = async (data: any) => {
        try {
            const newCustomer = await customerActions.createCustomer(data);
            setCustomers(prev => [...prev, newCustomer as Customer]);
            onSelect([...selectedCustomerIds, newCustomer.id]);
            setIsCreating(false);
        } catch (error) {
            alert('Erro ao criar cliente.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Cliente">
                <div className={styles.container}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Buscar clientes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.list}>
                        {isLoading ? (
                            <p className={styles.message}>Carregando...</p>
                        ) : filteredCustomers.length === 0 ? (
                            <p className={styles.message}>Nenhum cliente encontrado.</p>
                        ) : (
                            filteredCustomers.map(customer => (
                                <label key={customer.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomerIds.includes(customer.id)}
                                        onChange={() => handleToggleCustomer(customer.id)}
                                    />
                                    <span className={styles.name}>{customer.name}</span>
                                </label>
                            ))
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            className={styles.addBtn}
                            onClick={() => setIsCreating(true)}
                        >
                            + Novo Cliente
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>Concluir</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                title="Novo Cliente"
            >
                <CustomerForm
                    onSubmit={handleCreateCustomer}
                    onCancel={() => setIsCreating(false)}
                />
            </Modal>
        </>
    );
}
