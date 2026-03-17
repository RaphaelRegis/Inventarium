'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/common/Modal';
import * as supplierActions from '@/app/suppliers/actions';
import { Supplier } from '@/entities/suppliers/Supplier';
import SupplierForm from '@/components/suppliers/SupplierForm';
import styles from './SupplierSelectionModal.module.css';

interface SupplierSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSupplierIds: string[];
    onSelect: (ids: string[]) => void;
}

export default function SupplierSelectionModal({
    isOpen,
    onClose,
    selectedSupplierIds,
    onSelect
}: SupplierSelectionModalProps) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newSupplierName, setNewSupplierName] = useState('');

    const loadSuppliers = async () => {
        setIsLoading(true);
        try {
            const data = await supplierActions.fetchAllSuppliers();
            setSuppliers(data as Supplier[]);
        } catch (error) {
            console.error('Failed to load suppliers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadSuppliers();
        }
    }, [isOpen]);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [suppliers, searchQuery]);

    const handleToggleSupplier = (id: string) => {
        if (selectedSupplierIds.includes(id)) {
            onSelect(selectedSupplierIds.filter(sid => sid !== id));
        } else {
            onSelect([...selectedSupplierIds, id]);
        }
    };

    const handleCreateSupplier = async (data: Partial<Supplier>) => {
        try {
            const newSupplier = await supplierActions.createSupplier(data);
            setSuppliers(prev => [...prev, newSupplier as Supplier]);
            onSelect([...selectedSupplierIds, newSupplier.id]);
            setIsCreating(false);
        } catch (error) {
            alert('Erro ao criar fornecedor. Verifique se o nome já existe.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Fornecedores">
                <div className={styles.container}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Buscar fornecedores..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.list}>
                        {isLoading ? (
                            <p className={styles.message}>Carregando...</p>
                        ) : filteredSuppliers.length === 0 ? (
                            <p className={styles.message}>Nenhum fornecedor encontrado.</p>
                        ) : (
                            filteredSuppliers.map(supplier => (
                                <label key={supplier.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSupplierIds.includes(supplier.id)}
                                        onChange={() => handleToggleSupplier(supplier.id)}
                                    />
                                    <span className={styles.name}>{supplier.name}</span>
                                </label>
                            ))
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            className={styles.addBtn}
                            onClick={() => setIsCreating(true)}
                        >
                            + Novo Fornecedor
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>Concluir</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                title="Novo Fornecedor"
            >
                <SupplierForm
                    onSubmit={handleCreateSupplier}
                    onCancel={() => setIsCreating(false)}
                />
            </Modal>
        </>
    );
}
