import React from 'react';
import { Inventory } from '@/entities/inventories/Inventory';
import InventoryCard from './InventoryCard';
import styles from './InventoryGrid.module.css';

interface InventoryGridProps {
    inventories: Inventory[];
    onDelete: (inventory: Inventory) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function InventoryGrid({
    inventories,
    onDelete,
    currentPage,
    totalPages,
    onPageChange
}: InventoryGridProps) {
    if (inventories.length === 0) {
        return (
            <div className={`${styles.empty} glass`}>
                <p>Nenhum estoque encontrado para os filtros selecionados.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {inventories.map((inventory) => (
                    <InventoryCard
                        key={inventory.id}
                        inventory={inventory}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Página {currentPage} de {totalPages}</span>
                    <div className={styles.pageControls}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                            Anterior
                        </button>
                        <button
                            className={styles.pageBtn}
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Próxima
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
