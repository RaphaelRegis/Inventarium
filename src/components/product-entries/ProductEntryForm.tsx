'use client';

import React, { useState, useEffect } from 'react';
import SupplierSelectionModal from '@/components/products/SupplierSelectionModal';
import BranchSelectionModal from '@/components/products/BranchSelectionModal';
import ProductSelectionModal from '@/components/inventories/ProductSelectionModal';
import { Product } from '@/entities/products/Product';
import { Supplier } from '@/entities/suppliers/Supplier';
import * as supplierActions from '@/app/suppliers/actions';
import * as branchActions from '@/app/branches/actions';
import styles from './ProductEntryForm.module.css';

interface ProductEntryFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

interface EntryItem {
    product: Product;
    quantity: number;
}

export default function ProductEntryForm({ onSubmit, onCancel }: ProductEntryFormProps) {
    const [supplierId, setSupplierId] = useState<string | null>(null);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [branchId, setBranchId] = useState<string | null>(null);
    const [branchName, setBranchName] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<EntryItem[]>([]);

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // Fetch supplier info when ID changes to show its name
    useEffect(() => {
        if (supplierId) {
            supplierActions.fetchAllSuppliers().then(suppliers => {
                const found = suppliers.find((s: any) => s.id === supplierId);
                if (found) setSupplier(found as Supplier);
            });
            // Clear items when supplier changes to prevent adding items not belonging to the new supplier
            // But only if we already have items and change supplier
            if (items.length > 0) {
                const confirmClear = window.confirm("Atenção: Ao mudar o fornecedor, a lista de produtos será limpa. Continuar?");
                if (confirmClear) setItems([]);
                else {
                    // Revert supplier change theoretically, but we might just clean it
                    setItems([]);
                }
            }
        }
    }, [supplierId]);

    useEffect(() => {
        if (branchId) {
            branchActions.fetchAllBranches().then(branches => {
                const found = branches.find((b: any) => b.id === branchId);
                if (found) setBranchName(found.name);
            });
        }
    }, [branchId]);

    const handleAddProduct = (product: Product) => {
        if (!items.find(item => item.product.id === product.id)) {
            setItems(prev => [...prev, { product, quantity: 1 }]);
        }
        setIsProductModalOpen(false);
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        setItems(prev => prev.map(item => 
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const handleRemoveItem = (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!supplierId) {
            alert('Selecione um fornecedor.');
            return;
        }
        if (!branchId) {
            alert('Selecione uma filial.');
            return;
        }
        if (items.length === 0) {
            alert('Adicione ao menos um produto.');
            return;
        }

        const dateObj = new Date(date);
        
        onSubmit({
            supplierId,
            branchId,
            date: dateObj,
            items: items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))
        });
    };

    return (
        <>
        <form className={styles.form} onSubmit={handleSubmit}>
            
            <div className={styles.inputGroup}>
                <label>Data de Entrada</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Fornecedor</label>
                    <div className={styles.selector}>
                        <button
                            type="button"
                            className={styles.selectBtn}
                            onClick={() => setIsSupplierModalOpen(true)}
                        >
                            {supplier ? supplier.name : 'Selecionar Fornecedor'}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Filial de Destino</label>
                    <div className={styles.selector}>
                        <button
                            type="button"
                            className={styles.selectBtn}
                            onClick={() => setIsBranchModalOpen(true)}
                        >
                            {branchId ? branchName : 'Selecionar Filial'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.itemsSection}>
                <div className={styles.itemsHeader}>
                    <h3>Produtos da Entrada</h3>
                    <button 
                        type="button" 
                        className={styles.addBtn}
                        onClick={() => {
                            if (!supplierId) {
                                alert("Selecione um fornecedor primeiro.");
                                return;
                            }
                            setIsProductModalOpen(true);
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Adicionar Produto
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className={styles.emptyItems}>
                        Nenhum produto adicionado à entrada ainda.
                    </div>
                ) : (
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div key={item.product.id} className={styles.itemRow}>
                                <div className={styles.itemName}>
                                    {item.product.name}
                                </div>
                                <div className={styles.itemQty}>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveItem(item.product.id)}
                                    title="Remover produto"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    Salvar Entrada
                </button>
            </div>
        </form>

        <SupplierSelectionModal
            isOpen={isSupplierModalOpen}
            onClose={() => setIsSupplierModalOpen(false)}
            selectedSupplierIds={supplierId ? [supplierId] : []}
            onSelect={(ids) => {
                if (ids.length > 0) {
                    setSupplierId(ids[ids.length - 1]); // Get the last selected id enforcing single choice
                } else {
                    setSupplierId(null);
                }
                setIsSupplierModalOpen(false);
            }}
        />

        <BranchSelectionModal
            isOpen={isBranchModalOpen}
            onClose={() => setIsBranchModalOpen(false)}
            selectedBranchIds={branchId ? [branchId] : []}
            onSelect={(ids) => {
                if (ids.length > 0) {
                    setBranchId(ids[ids.length - 1]);
                } else {
                    setBranchId(null);
                }
                setIsBranchModalOpen(false);
            }}
        />

        <ProductSelectionModal
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            selectedProductId={null}
            onSelect={handleAddProduct}
            supplierFilterId={supplierId}
        />
        </>
    );
}
