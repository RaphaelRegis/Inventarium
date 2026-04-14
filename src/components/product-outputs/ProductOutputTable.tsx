import React from 'react';
import { ProductOutput } from '@/entities/product-outputs/ProductOutput';
import styles from '@/components/product-entries/ProductEntryTable.module.css';

interface ProductOutputTableProps {
    outputs: ProductOutput[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ProductOutputTable({
    outputs,
    currentPage,
    totalPages,
    onPageChange
}: ProductOutputTableProps) {
    if (outputs.length === 0) {
        return (
            <div className={`${styles.empty} glass`}>
                <p>Nenhuma saída encontrada para os filtros selecionados.</p>
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
                                <th>Cliente</th>
                                <th>Filial Origem</th>
                                <th>Itens</th>
                                <th className={styles.rightAlign}>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outputs.map((output) => (
                                <tr key={output.id}>
                                    <td>
                                        <span className={styles.date}>{formatDate(output.date)}</span>
                                    </td>
                                    <td>
                                        <div className={styles.supplierInfo}>
                                            <span className={styles.supplierName}>{output.customer?.name || 'Cliente Avulso'}</span>
                                        </div>
                                    </td>
                                    <td>{output.branch?.name || '-'}</td>
                                    <td>
                                        <div className={styles.itemsList}>
                                            {output.items?.map((item) => (
                                                <span key={item.id} className={styles.itemPill}>
                                                    {item.quantity}x {item.product?.name || 'Produto'}
                                                </span>
                                            ))}
                                            {(!output.items || output.items.length === 0) && '-'}
                                        </div>
                                    </td>
                                    <td className={styles.rightAlign}>
                                        <span className={styles.value}>{formatCurrency(Number(output.totalValue))}</span>
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
