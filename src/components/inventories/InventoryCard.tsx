'use client';

import React from 'react';
import { Inventory } from '@/entities/inventories/Inventory';
import styles from './InventoryCard.module.css';

interface InventoryCardProps {
    inventory: Inventory;
    onDelete: (inventory: Inventory) => void;
}

export default function InventoryCard({ inventory, onDelete }: InventoryCardProps) {
    const isDeletable = inventory.quantity === 0;

    return (
        <div className={`${styles.card} glass`}>
            <div className={styles.header}>
                <h3 className={styles.productName}>{inventory.product?.name || 'Desconhecido'}</h3>
            </div>
            
            <div className={styles.body}>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Filial:</span>
                    <span className={styles.value}>{inventory.branch?.name || 'Desconhecida'}</span>
                </div>
                
                <div className={styles.infoRow}>
                    <span className={styles.label}>Quantidade:</span>
                    <span className={`${styles.quantityValue} ${inventory.quantity < 0 ? styles.negative : inventory.quantity > 0 ? styles.positive : styles.zero}`}>
                        {inventory.quantity}
                    </span>
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    className={`${styles.deleteBtn} ${!isDeletable ? styles.disabled : ''}`}
                    onClick={() => isDeletable && onDelete(inventory)}
                    disabled={!isDeletable}
                    title={!isDeletable ? "Apenas estoques zerados podem ser excluídos" : "Excluir estoque"}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Excluir</span>
                </button>
            </div>
        </div>
    );
}
