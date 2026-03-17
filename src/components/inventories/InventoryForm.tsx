'use client';

import React, { useState } from 'react';
import ProductSelectionModal from './ProductSelectionModal';
import BranchSelectionModal from '@/components/products/BranchSelectionModal';
import styles from '@/components/products/ProductForm.module.css'; // Reuse to save styling logic for simple layout

interface InventoryFormProps {
    onSubmit: (productId: string, branchIds: string[]) => void;
    onCancel: () => void;
}

export default function InventoryForm({ onSubmit, onCancel }: InventoryFormProps) {
    const [productId, setProductId] = useState<string | null>(null);
    const [branchIds, setBranchIds] = useState<string[]>([]);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) {
            alert('Por favor, selecione um produto.');
            return;
        }
        if (branchIds.length === 0) {
            alert('Por favor, selecione ao menos uma filial.');
            return;
        }
        onSubmit(productId, branchIds);
    };

    return (
        <>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label>Produto</label>
                <div className={styles.supplierSelector}>
                    <button
                        type="button"
                        className={styles.selectBtn}
                        onClick={() => setIsProductModalOpen(true)}
                    >
                        {productId ? 'Produto Selecionado (Alterar)' : 'Selecionar Produto'}
                    </button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>Filiais de Estoque</label>
                <div className={styles.supplierSelector}>
                    <button
                        type="button"
                        className={styles.selectBtn}
                        onClick={() => setIsBranchModalOpen(true)}
                    >
                        {branchIds.length > 0
                            ? `${branchIds.length} filial(is) selecionada(s)`
                            : 'Selecionar Filiais'}
                    </button>
                    {branchIds.length > 0 && (
                        <span className={styles.supplierHint}>Clique para alterar</span>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    Criar Estoque(s)
                </button>
            </div>
        </form>

        <ProductSelectionModal
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            selectedProductId={productId}
            onSelect={(id) => setProductId(id)}
        />

        <BranchSelectionModal
            isOpen={isBranchModalOpen}
            onClose={() => setIsBranchModalOpen(false)}
            selectedBranchIds={branchIds}
            onSelect={(ids) => setBranchIds(ids)}
            isEditMode={false} // Form is exclusively for creation.
        />
        </>
    );
}
