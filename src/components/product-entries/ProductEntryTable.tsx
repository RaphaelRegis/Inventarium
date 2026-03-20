import React from 'react';
import { ProductEntry } from '@/entities/product-entries/ProductEntry';
import styles from './ProductEntryTable.module.css';

interface ProductEntryTableProps {
    entries: ProductEntry[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    getValue: (entry: ProductEntry) => number;
}

export default function ProductEntryTable({
    entries,
    currentPage,
    totalPages,
    onPageChange,
    getValue
}: ProductEntryTableProps) {
    if (entries.length === 0) {
        return (
            <div className={`${styles.empty} glass`}>
                <p>Nenhuma entrada encontrada para os filtros selecionados.</p>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));
    };

    return (
        <div className={styles.tableWrapper}>
            <div className={`${styles.container} glass`}>
                <div className={styles.responsiveTable}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Fornecedor</th>
                                <th>Filial Destiny</th>
                                <th>Itens</th>
                                <th className={styles.rightAlign}>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => (
                                <tr key={entry.id}>
                                    <td>
                                        <span className={styles.date}>{formatDate(entry.date)}</span>
                                    </td>
                                    <td>
                                        <div className={styles.supplierInfo}>
                                            <span className={styles.supplierName}>{entry.supplier?.name || '-'}</span>
                                        </div>
                                    </td>
                                    <td>{entry.branch?.name || '-'}</td>
                                    <td>
                                        <div className={styles.itemsList}>
                                            {entry.items?.map((item, idx) => (
                                                <span key={item.id} className={styles.itemPill}>
                                                    {item.quantity}x {item.product?.name || 'Produto'}
                                                </span>
                                            ))}
                                            {(!entry.items || entry.items.length === 0) && '-'}
                                        </div>
                                    </td>
                                    <td className={styles.rightAlign}>
                                        <span className={styles.value}>{formatCurrency(getValue(entry))}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    );
}
