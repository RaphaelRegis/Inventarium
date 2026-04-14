'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/common/Modal';
import * as inventoryActions from '@/app/inventories/actions';
import { Inventory } from '@/entities/inventories/Inventory';
import styles from '@/components/products/SupplierSelectionModal.module.css';

interface BranchInventorySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    branchId: string | null;
    onSelect: (inventory: Inventory) => void;
}

export default function BranchInventorySelectionModal({
    isOpen,
    onClose,
    branchId,
    onSelect
}: BranchInventorySelectionModalProps) {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadInventories = async () => {
        setIsLoading(true);
        try {
            const data = await inventoryActions.fetchAllInventories();
            setInventories(data as Inventory[]);
        } catch (error) {
            console.error('Failed to load inventories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadInventories();
        }
    }, [isOpen]);

    const availableInventories = useMemo(() => {
        return inventories
            .filter(inv => inv.branchId === branchId && inv.quantity > 0)
            .filter(inv => inv.product?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [inventories, branchId, searchQuery]);

    const handleSelectInventory = (inventory: Inventory) => {
        onSelect(inventory);
        // It's usually expected to auto-close or allow multiple. 
        // We'll let the parent decide, but for UX, let's just trigger onSelect.
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Produto do Estoque">
            <div className={styles.container}>
                {!branchId ? (
                    <p className={styles.message}>Por favor, selecione uma filial primeiro.</p>
                ) : (
                    <>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Buscar produtos disponíveis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.list}>
                            {isLoading ? (
                                <p className={styles.message}>Carregando estoques...</p>
                            ) : availableInventories.length === 0 ? (
                                <p className={styles.message}>Nenhum produto em estoque nesta filial.</p>
                            ) : (
                                availableInventories.map(inv => (
                                    <label key={inv.id} className={styles.item}>
                                        <input
                                            type="radio"
                                            name="selectedInventory"
                                            onChange={() => handleSelectInventory(inv)}
                                        />
                                        <span className={styles.name}>
                                            {inv.product?.name} (Disp: {inv.quantity}) - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inv.product?.retailPrice))}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </>
                )}

                <div className={styles.footer}>
                    <button className={styles.closeBtn} onClick={onClose} style={{ marginLeft: 'auto' }}>Concluir</button>
                </div>
            </div>
        </Modal>
    );
}
